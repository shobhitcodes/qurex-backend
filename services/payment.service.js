const Razorpay = require('razorpay');
const User = require('../models/user');
const Payment = require('../models/payment');
const crypto = require('crypto');
const Booking = require('../models/booking');
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});


module.exports.createOrder = createOrder;
module.exports.verifySuccess = verifySuccess;
module.exports.logPaymentError = logPaymentError;
module.exports.getAllPayments = getAllPayments;
module.exports.getAllFailedPayments = getAllFailedPayments;
module.exports.addPaymentDispute = addPaymentDispute;
module.exports.getAllPatientPayments = getAllPatientPayments;
module.exports.getAllPaymentForDoctor = getAllPaymentForDoctor;

/**
 * @async
 * @description get All Modules
 * @param {*} amount in paise
 * @param {*} receipt or invoiceId
 * @param {*} userId
 * @param {*} currency in INR
 * 
 * @returns
 */
async function createOrder(amount, receipt, userId, currency = "INR") {
    try {
        const order = await _doCreateOrder(amount, receipt, currency);
        const user = await User.findById(userId);
        const paymentObj = {
            userid: userId,
            razorPayOrderId: order.id,
            receipt: order.receipt,
            amount: order.amount,
            currency: order.currency,
            notes: order.notes,
            prefillName: user.name,
            prefillContact: user.mobile,
            prefillEmail: user.email,
            status: 'pending'
        }
        const paymentReq = await Payment.create(paymentObj)
        return paymentReq;
    } catch (err) {
        console.error('Error on Payment service: ', err);
        throw err;
    }
}

async function verifySuccess(razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId) {
    try {
        let generatedSignature = crypto
            .createHmac(
                "SHA256",
                process.env.RAZORPAY_SECRET
            ).update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        let isSignatureValid = generatedSignature == razorpay_signature;

        const update = await Payment.updateOne(
            { razorPayOrderId: razorpay_order_id },
            {
                razorPayPaymentId: razorpay_payment_id,
                razorPaySignature: razorpay_signature,
                isVerified: isSignatureValid,
                isSuccess: true,
                status: 'success'

            }
        );
        const bookingUpdate = await Booking.updateOne({ _id: bookingId }, {
            isPaid: true,
            payment: {
                razorPayPaymentId: razorpay_payment_id,
            }
        });
        if (update && update.modifiedCount) {
            return isSignatureValid;
        } else {
            throw update;
        }


    } catch (err) {
        console.error('Error on Payment service: ', err);
        throw err;
    }
}

async function logPaymentError(errorLog) {
    try {
        const orderId = errorLog.metadata.order_id;
        const razorPayPaymentId = errorLog.metadata.payment_id;
        const payment = await Payment.updateOne(
            { razorPayOrderId: orderId },
            {
                razorPayPaymentId: razorPayPaymentId,
                isFailed: true,
                failError: errorLog,
                status: 'failed'
            }
        );
        if (payment && payment.modifiedCount) {
            return orderId;
        } else {
            throw payment;
        }
    } catch (error) {
        console.error('Error on Payment service: ', error);
        throw error;
    }
}

async function getAllPayments(limit, offset) {
    try {
        const payments = await Payment.find({
            isSuccess: true,
            isVerified: true
        }).sort({ _id: -1 })
            .limit(limit)
            .skip(offset)
            .populate('userid')

        return payments;
    } catch (error) {
        console.error('Error on Payment service: ', error);
        throw error;
    }
}


async function getAllPatientPayments(patientId, limit, offset) {
    try {
        const payments = await Payment.find({
            isFailed: true,
            userid: patientId
        }).sort({ _id: -1 })
            .limit(limit)
            .skip(offset)


        return payments;
    } catch (error) {
        console.error('Error on Payment service: ', error);
        throw error;
    }
}

async function getAllPaymentForDoctor(doctorId, limit, offset) {
    try {
        const doctorPaidBookings = await Booking.find({ doctorId, isPaid: true });
        const razorPayPaymentIds = []
        doctorPaidBookings.forEach(x => {
            razorPayPaymentIds.push(x.payment.razorPayPaymentId)
        })

        const payments = await Payment.find({
            razorPayPaymentId: { $in: razorPayPaymentIds }
        }).sort({ _id: -1 })
            .limit(limit)
            .skip(offset)
        return payments;
    } catch (error) {
        console.error('Error on Payment service: ', error);
        throw error;
    }
}

async function getAllFailedPayments(limit, offset) {
    try {
        const payments = await Payment.find({
            isFailed: true
        }).sort({ _id: -1 })
            .limit(limit)
            .skip(offset)
            .populate('userid')

        return payments;
    } catch (error) {
        console.error('Error on Payment service: ', error);
        throw error;
    }
}

async function addPaymentDispute(paymentId, disputeReason) {
    try {
        const paymentUpdate = await Payment.updateOne({ _id: paymentId }, { isDisputed: true, disputeReason });
        if (paymentUpdate && paymentUpdate.modifiedCount) {
            return paymentId
        } else {
            throw paymentUpdate;
        }
    } catch (error) {
        console.error('Error on Payment service: ', error);
        throw error;
    }
}

function _doCreateOrder(amount, reciept, currency) {
    return new Promise((resolve, reject) => {
        const orderOption = {
            amount: amount,
            currency: currency,
            receipt: reciept
        }
        instance.orders.create(orderOption, (err, order) => {
            if (err) {
                reject(err);
            }
            resolve(order)
        })
    })

}
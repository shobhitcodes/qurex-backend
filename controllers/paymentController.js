'use strict';

const utils = require('../helpers/utils');
const paymentService = require('../services/payment.service')

// module.exports.createOrder = createOrder;
module.exports.logPaymentError = logPaymentError;
module.exports.getAllPayments = getAllPayments;
module.exports.getAllPatientPayments = getAllPatientPayments;
module.exports.getAllPaymentForDoctor = getAllPaymentForDoctor;
module.exports.getAllFailedPayments = getAllFailedPayments;
module.exports.verifySuccessfulPayment = verifySuccessfulPayment;



/**
 * @async
 * @description Request handler for creating Order
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllPayments(req, res) {
    try {
        const { limit, offset } = req.query;
        const payments = await paymentService.getAllPayments(limit || 100, offset || 0);
        res.json(utils.formatResponse(1, payments));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for creating Order
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllFailedPayments(req, res) {
    try {
        const { limit, offset } = req.query;
        const payments = await paymentService.getAllFailedPayments(limit || 100, offset || 0);
        res.json(utils.formatResponse(1, payments));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for getting payment by patients
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllPatientPayments(req, res) {
    try {
        const { limit, offset } = req.query;
        const patientId = req.params.patientId;
        const payments = await paymentService.getAllPatientPayments(patientId, limit || 100, offset || 0);
        res.json(utils.formatResponse(1, payments));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for getting payment of doctors
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllPaymentForDoctor(req, res) {
    try {
        const { limit, offset } = req.query;
        const doctorId = req.params.doctorId;
        const payments = await paymentService.getAllPaymentForDoctor(doctorId, limit || 100, offset || 0);
        res.json(utils.formatResponse(1, payments));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
// /**
//  * @async
//  * @description Request handler for creating Order
//  * @param {Express.Request} req
//  * @param {Express.Response} res
//  */
// async function addPaymentDispute(req, res) {
//     try {
//         const {paymentId, disputeReason} = req.body;
//         const payments = await paymentService.addPaymentDispute(paymentId, disputeReason);
//         res.json(utils.formatResponse(1, payments));
//     } catch (err) {
//         console.error('Error on register handler: ', err);
//         res.json(utils.formatResponse(0, err));
//     }
// }


/**
 * @async
 * @description Request handler for creating Order
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function verifySuccessfulPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        const order = await paymentService.verifySuccess(razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId);
        res.json(utils.formatResponse(1, order));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for creating Order
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function logPaymentError(req, res) {
    try {
        const errorLog = req.body.errorLog;
        const order = await paymentService.logPaymentError(errorLog);
        res.json(utils.formatResponse(1, order));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
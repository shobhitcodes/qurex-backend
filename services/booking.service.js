const User = require('../models/user');
const DoctorDetail = require('../models/doctorDetail');
const Booking = require('../models/booking');
const Session = require('../models/session');
const moment = require('moment');
const PaymentService = require('./payment.service');
const DoctorService = require('./doctorService');

module.exports.bookAppointment = bookAppointment;
module.exports.getBookingsByDate = getBookingsByDate;
module.exports.updateBookingStatus = updateBookingStatus;
module.exports.getBookingsByFromAndToTime = getBookingsByFromAndToTime;
module.exports.getByUserId = getByUserId;
module.exports.update = update;
module.exports.cancel = cancel;

/**
 * @async
 * @description booking appointment
 * @param {*} patientId
 * @param {*} doctorId
 * @param {*} meta
 * @param {*} from
 * @param {*} to
 * @returns
 */
async function bookAppointment(patientId, doctorId, meta, from) {
    try {
        // todo : check if timings fit doc time slot
        const docDetail = await DoctorService.getByUserId(doctorId);

        let to = moment(from).add(docDetail.professionalDetail.sessionDuration || 30, 'minutes');

        // if(docDetail && docDetail.availableSlots) {
        //     if(
        //         moment(from).utc().isBefore(moment(docDetail.availableSlots.from).utc()) ||
        //         moment(from).utc().isAfter(moment(docDetail.availableSlots.to).utc()) ||
        //         moment(to).utc().isBefore(moment(docDetail.availableSlots.from).utc()) ||
        //         moment(to).utc().isAfter(moment(docDetail.availableSlots.to).utc())
        //     ){
        //         throw 'No Available slots for current timings.';

        //     }
        // }

        // const query = {
        //     doctorId,
        //     $or: [
        //         {
        //             from: {
        //                 $gte: moment(from).utc(),
        //                 $lt: moment(to).utc().toDate(),
        //             },
        //         },
        //         { to: { $gte: moment(from).utc(), $lt: moment(to).utc() } },
        //     ],
        //     active: true,
        //     status: { $ne: 'Cancelled' },
        // };
        // const isPreBooked = await Booking.find(query);

        // if (isPreBooked && isPreBooked.length > 0) {
        //     throw 'Booking Colliding with Current Booking Timings';
        // }

        const reciept = `PatientBooking-${moment(from).format('DD-MM-YYYY')}-${
            docDetail.professionalDetail.feeCharge
        }`;
        
        const paymentOrder = await PaymentService.createOrder(
            docDetail.professionalDetail.feeCharge,
            reciept,
            patientId
        );

        let booking = new Booking({
            patientId,
            doctorId,
            meta,
            fees: docDetail.professionalDetail.feeCharge,
            from: moment(from).utc(),
            to: moment(to).utc(),
            payment: {
                razorPayOrderId: paymentOrder.razorPayOrderId,
            },
        });
        booking = await booking.save();

        console.log(booking);

        let session = new Session({
            patientId,
            doctorId,
            bookingId: booking._id,
            channelName: booking.bookingId,
            startTime: moment(from).utc(),
            endTime: moment(to).utc(),
            expectedDuration: docDetail.professionalDetail.sessionDuration,
        });
        session = await session.save();

        booking.sessionId = session._id;
        booking = await booking.save();
        console.log({booking});

        return booking;
    } catch (error) {
        console.error('Error on Booking service: ', error);
        throw error;
    }
}

/**
 * @async
 * @description get booking appointment by date
 * @param {*} date
 * @param {*} doctorId
 * @returns
 */
async function getBookingsByDate(date, doctorId) {
    try {
        const startTime = moment(date).utc().startOf('day');
        const endTime = moment(date).utc().endOf('day');
        const query = {
            doctorId,
            from: { $gte: startTime, $lt: endTime },
            active: true,
            status: { $ne: 'Cancelled' },
        };
        const bookings = await Booking.find(query);
        return bookings;
    } catch (error) {
        console.error('Error on Booking service: ', error);
        throw error;
    }
}

/**
 * @async
 * @description get booking appointment by date
 * @param {*} date
 * @param {*} doctorId
 * @returns
 */
async function getBookingsByFromAndToTime(from, to, doctorId) {
    try {
        const query = {
            doctorId,
            $or: [
                { from: { $gte: moment(from).utc(), $lt: moment(to).utc() } },
                { to: { $gte: moment(from).utc(), $lt: moment(to).utc() } },
            ],
            active: true,
            status: { $ne: 'Cancelled' },
        };
        const bookings = await Booking.find(query);
        return bookings;
    } catch (error) {
        console.error('Error on Booking service: ', error);
        throw error;
    }
}

/**
 * @async
 * @description get booking appointment by date
 * @param {*} bookingId
 * @param {*} status
 * @returns
 */
async function updateBookingStatus(bookingId, status) {
    try {
        const query = {
            _id: bookingId,
        };
        const updatedBooking = await Booking.updateOne(query, {
            status: status,
        });
        if (updatedBooking && updatedBooking.modifiedCount) {
            return { bookingId, status };
        } else {
            throw updatedBooking;
        }
    } catch (error) {
        console.error('Error on Booking service: ', error);
        throw error;
    }
}

async function getByUserId(id) {
    try {
        if (!id) throw 'id missing';

        const bookings = await Booking.find({ $or: [ { patientId: id }, { doctorId: id } ] }).populate(['sessionId', 'doctorId', 'patientId']);
        return bookings;
    } catch (err) {
        console.error('Error on getByUserId doctor service: ', err);
        throw err;
    }
}

async function update(id, booking) {
    try {
        if (!id || !booking) throw 'required data missing';

        booking = await Booking.findByIdAndUpdate(id, booking, {
            new: true,
        });

        if (!booking) throw 'booking not found';

        return booking;
    } catch (err) {
        console.error('Error on update booking service: ', err);
        throw err;
    }
}

async function cancel(id) {
    try {
        if (!id) throw 'id missing';

        booking = await Booking.findByIdAndUpdate(id, { status: 'Cancelled'}, {
            new: true,
        });

        if (!booking) throw 'booking not found';

        return booking;
    } catch (err) {
        console.error('Error on cancel booking service: ', err);
        throw err;
    }
}
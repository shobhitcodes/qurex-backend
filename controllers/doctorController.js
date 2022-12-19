'use strict';

const utils = require('../helpers/utils');
const userService = require('../services/userService');
const doctorService = require('../services/doctorService');
const bookingService = require('../services/booking.service');

module.exports.getById = getById;
module.exports.getByUserId = getByUserId;
module.exports.getAll = getAll;
module.exports.create = create;
module.exports.update = update;
module.exports.deleteOne = deleteOne;
module.exports.register = register;
module.exports.bookAppointment = bookAppointment;
module.exports.getBookingsByDate = getBookingsByDate;
module.exports.getBookingsByFromAndToTime = getBookingsByFromAndToTime;
module.exports.updateAppointmentStatus = updateAppointmentStatus;
module.exports.getUnverified = getUnverified;
module.exports.verify = verify;
module.exports.availableSlots = availableSlots;
module.exports.getBookings = getBookings;
module.exports.getBookingById = getBookingById;
module.exports.getBookingByUserId = getBookingByUserId;
module.exports.getAllDocForHomePage = getAllDocForHomePage;
module.exports.updateByUserId = updateByUserId;
module.exports.dashDetails = dashDetails;

/**
 * @async
 * @description Request handler for fetching doctor
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getById(req, res) {
    try {
        const { id } = req.params;
        const doctor = await doctorService.get(id);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor getById handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching doctor by userId
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getByUserId(req, res) {
    try {
        const { id } = req.params;
        const doctor = await doctorService.getByUserId(id);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor getByUserId handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching doctors
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAll(req, res) {
    try {
        const doctors = await doctorService.getAll();
        res.json(utils.formatResponse(1, doctors));
    } catch (err) {
        console.error('Error on doctor getAll handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for create doctor
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function create(req, res) {
    try {
        const data = req.body;
        const doctor = await doctorService.create(data);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor create handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for update doctor
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function update(req, res) {
    try {
        const { id } = req.params;
        let doctor = req.body;
        doctor = await doctorService.update(id, doctor);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor update handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for delete doctor
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function deleteOne(req, res) {
    try {
        const { id } = req.params;
        await doctorService.deleteOne(id);
        res.json(utils.formatResponse(1));
    } catch (err) {
        console.error('Error on doctor deleteOne handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for registering Doc
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = await userService.register(
            name,
            email,
            password,
            'doctor'
        );
        const token = user.generateAuthToken();
        res.header('x-auth-token', token);
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for booking doc appointment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function bookAppointment(req, res) {
    try {
        const { patientId, doctorId, meta, from } = req.body;
        const newBooking = await bookingService.bookAppointment(
            patientId,
            doctorId,
            meta,
            from
        );
        res.json(utils.formatResponse(1, newBooking));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for booking doc appointment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getBookingsByDate(req, res) {
    try {
        const { date, doctorId } = req.body;
        const bookings = await bookingService.getBookingsByDate(date, doctorId);
        res.json(utils.formatResponse(1, bookings));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for booking doc appointment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getBookingsByFromAndToTime(req, res) {
    try {
        const { from, to, doctorId } = req.body;
        const bookings = await bookingService.getBookingsByFromAndToTime(
            from,
            to,
            doctorId
        );
        res.json(utils.formatResponse(1, bookings));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for booking doc appointment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function updateAppointmentStatus(req, res) {
    try {
        const { bookingId, status } = req.body;
        const newBooking = await bookingService.updateBookingStatus(
            bookingId,
            status
        );
        res.json(utils.formatResponse(1, newBooking));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function getUnverified(req, res) {
    try {
        const doctors = await doctorService.getUnverified();
        res.json(utils.formatResponse(1, doctors));
    } catch (err) {
        console.error('Error on doctor getUnverified handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function verify(req, res) {
    try {
        const { id } = req.params;
        const doctor = await doctorService.verify(id);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor verify handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function availableSlots(req, res) {
    try {
        console.log('here101');
        const { id } = req.params;
        console.log('availableSlots handler');
        const availableSlots = await doctorService.availableSlots(id);
        res.json(utils.formatResponse(1, availableSlots));
    } catch (err) {
        console.error('Error on doctor availableSlots handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function getBookings(req, res) {
    try {
        const { id } = req.params;
        const bookings = await doctorService.getBookings(id);
        res.json(utils.formatResponse(1, bookings));
    } catch (err) {
        console.error('Error on doctor getBookings handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}


async function getBookingById(req, res) {
    try {
        console.log('here101');
        const { id } = req.params;
        const booking = await doctorService.getBookingById(id);
        res.json(utils.formatResponse(1, booking));
    } catch (err) {
        console.error('Error on doctor getBookingById handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function getBookingByUserId(req, res) {
    try {
        const { id } = req.params;
        const bookings = await bookingService.getByUserId(id);
        res.json(utils.formatResponse(1, bookings));
    } catch (err) {
        console.error('Error on booking getByUserId handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function getAllDocForHomePage(req, res) {
    try {
        const doctors = await doctorService.getAllDocForHomePage();
        res.json(utils.formatResponse(1, doctors));

    } catch (error) {
        console.error('Error on booking getByUserId handler: ', error);
        res.json(utils.formatResponse(0, error));
    }
}

async function updateByUserId(req, res) {
    try {
        const { id } = req.params;
        let doctor = req.body;
        doctor = await doctorService.updateByUserId(id, doctor);
        res.json(utils.formatResponse(1, doctor));
    } catch (err) {
        console.error('Error on doctor updateByUserId handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function dashDetails(req, res) {
    try {
        const { id } = req.params;
        const details = await doctorService.dashDetails(id);
        res.json(utils.formatResponse(1, details));
    } catch (err) {
        console.error('Error on doctor dashDetails handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

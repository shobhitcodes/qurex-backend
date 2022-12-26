'use strict';

const moment = require('moment');
const { defaultDoctorBusinessHours } = require('../constants/businessHours');

// model imports
const DoctorDetail = require('../models/doctorDetail');
const Booking = require('../models/booking');

// public interface
module.exports.getById = getById;
module.exports.getByUserId = getByUserId;
module.exports.getAll = getAll;
module.exports.create = create;
module.exports.update = update;
module.exports.deleteOne = deleteOne;
module.exports.getUnverified = getUnverified;
module.exports.verify = verify;
module.exports.availableSlots = availableSlots;
module.exports.getBookings = getBookings;
module.exports.getBookingById = getBookingById;
module.exports.getAllDocForHomePage = getAllDocForHomePage;
module.exports.updateByUserId = updateByUserId;
module.exports.dashDetails = dashDetails;

async function getById(id) {
    try {
        if (!id) throw 'id missing';

        const doctor = await DoctorDetail.findById(id);
        console.log({ doctor });
        return doctor;
    } catch (err) {
        console.error('Error on getById doctor service: ', err);
        throw err;
    }
}

async function getByUserId(id) {
    try {
        if (!id) throw 'id missing';

        const doctor = await DoctorDetail.findOne({ userId: id }).populate('userId');;
        return doctor;
    } catch (err) {
        console.error('Error on getByUserId doctor service: ', err);
        throw err;
    }
}

async function getAll() {
    try {
        const doctors = await DoctorDetail.find().populate('userId');
        console.log({ doctors });
        return doctors;
    } catch (err) {
        console.error('Error on getAll doctor service: ', err);
        throw err;
    }
}

async function create(doctor) {
    try {
        if (!doctor) throw 'data missing';

        doctor.businessHours = defaultDoctorBusinessHours;
        doctor = new DoctorDetail(doctor);
        doctor = await doctor.save();

        console.log({ doctor });
        return doctor;
    } catch (err) {
        console.error('Error on create doctor service: ', err);
        throw err;
    }
}

async function update(id, doctor) {
    try {
        if (!id || !doctor) throw 'required data missing';

        doctor = await DoctorDetail.findByIdAndUpdate(id, doctor, {
            new: true,
        });

        if (!doctor) throw 'doctor not found';

        console.log({ doctor });
        return doctor;
    } catch (err) {
        console.error('Error on update doctor service: ', err);
        throw err;
    }
}

async function updateByUserId(id, doctor) {
    try {
        if (!id || !doctor) throw 'required data missing';

        doctor = await DoctorDetail.findOneAndUpdate({ userId: id }, doctor, {
            new: true,
        });
   
        if (!doctor) throw 'doctor not found';

        return doctor;
    } catch (err) {
        console.error('Error on updateByUserId doctor service: ', err);
        throw err;
    }
}

async function deleteOne(id) {
    try {
        if (!id) throw 'id missing';

        return await DoctorDetail.findByIdAndDelete(id);
    } catch (err) {
        console.error('Error on deleteOne doctor service: ', err);
        throw err;
    }
}
async function getUnverified() {
    try {
        const doctors = await DoctorDetail.find({ verified: false });
        console.log({ doctors });
        return doctors;
    } catch (err) {
        console.error('Error on getUnverified doctor service: ', err);
        throw err;
    }
}

async function verify(id) {
    try {
        if (!id) throw 'id missing';

        let doctor = await DoctorDetail.findByIdAndUpdate(
            id,
            { verified: true },
            {
                new: true,
            }
        );

        if (!doctor) throw 'doctor not found';

        return doctor;
    } catch (err) {
        console.error('Error on verify doctor service: ', err);
        throw err;
    }
}

async function availableSlots(id) {
    try {
        if (!id) throw 'id missing';

        let doctor = await getByUserId(id);
        if (!doctor) throw 'doctor not found';

        const today = moment().utc();
        const nextWeek = moment().utc().add(6, 'd');
        const dateMap = {};

        for (let i = 0; i <= 6; i++) {
            dateMap[moment().utc().add(i, 'd').format('DD-MM-YYYY')] = [];
        }

        for (const key in dateMap) {
            let currentDay = moment(key, 'DD-MM-YYYY')
                .format('dddd')
                .toLowerCase();
            dateMap[key] = doctor.businessHours.find(
                (item) => item.day === currentDay
            ).slots;
        }

        const availableSlotsMap = {};

        Object.keys(dateMap).forEach((key) => {
            const availableChunks = dateMap[key];
            const slots = [];

            availableChunks.forEach((chunk) => {
                const _slots = getTimeSlots(chunk.from, chunk.to, doctor.professionalDetail.sessionDuration);
                slots.push(..._slots);
            });

            availableSlotsMap[key] = slots;
        });

        const doctorQuery = {
            doctorId: id,
            from: {
                $gte: today.startOf('d').toDate(),
                $lte: nextWeek.endOf('d').toDate(),
            },
            active: true,
            status: { $nin: ['Cancelled', 'Completed', 'PendingConfirmation'] },
            // , 'PendingConfirmation'
        };

        const doctorBookings = await Booking.find(doctorQuery);

        const doctorBookingMap = {};

        Object.keys(dateMap).forEach((key) => (doctorBookingMap[key] = []));

        doctorBookings.forEach((booking) => {
            let bookingDate = moment(booking.from).utc().format('DD-MM-YYYY');

            if (doctorBookingMap[bookingDate]) {
                let from = moment(booking.from).utc().format('HH:mm');
                let to = moment(booking.to).utc().format('HH:mm');
                doctorBookingMap[bookingDate].push({ from, to });
            }
        });

        const bookedSlotsMap = {};

        Object.keys(doctorBookingMap).forEach((key) => {
            const bookedChunks = doctorBookingMap[key];
            const slots = [];

            bookedChunks.forEach((chunk) => {
                const _slots = getTimeSlots(chunk.from, chunk.to);
                slots.push(..._slots);
            });

            bookedSlotsMap[key] = slots;
        });

        const finalMap = {};

        Object.keys(availableSlotsMap).forEach((key) => {
            finalMap[key] = [];

            availableSlotsMap[key].forEach((time) =>
                finalMap[key].push({ time, isAvailable: true })
            );
        });

        Object.keys(finalMap).forEach((key) => {
            if (bookedSlotsMap[key]) {
                finalMap[key].forEach((slot) => {
                    if (bookedSlotsMap[key].includes(slot.time))
                        slot.isAvailable = false;
                });
            }
        });

        return finalMap;
    } catch (err) {
        console.error('Error on availableSlots doctor service: ', err);
        throw err;
    }
}

function getTimeSlots(start, end, sessionDuration = 15) {
    var startTime = moment(start, 'HH:mm');
    var endTime = moment(end, 'HH:mm');

    if (endTime.isBefore(startTime)) {
        endTime.add(1, 'day');
    }

    var timeStops = [];

    while (startTime <= endTime) {
        timeStops.push(new moment(startTime).format('HH:mm'));
        startTime.add(sessionDuration, 'minutes');
    }

    return timeStops;
}

async function getBookings(id) {
    try {
        const bookingQuery = {
            doctorId: id,
            active: true,
        };

        const doctorBookings = await Booking.find(bookingQuery).populate(
            ['sessionId', 'patientId', 'doctorId']
        );
        console.log({ doctorBookings });
        return doctorBookings;
    } catch (err) {
        console.error('Error on getBookings doctor service: ', err);
        throw err;
    }
}

async function getBookingById(id) {
    try {
        if (!id) throw 'id missing';

        const booking = await Booking.findById(id).populate('sessionId');
        return booking;
    } catch (err) {
        console.error('Error on getBookingById doctor service: ', err);
        throw err;
    }
}

async function getAllDocForHomePage() {
    try {
        const doctors = await DoctorDetail.find({ verified: true }, {
        // const doctors = await DoctorDetail.find({}, {
            professionalDetail : 1,
            education : 1,
            experience : 1,
            awards : 1,
            rating : 1,
            businessHours: 1
        })
        .populate('userId', 'name salutation profilePic')
        return doctors;
    } catch (error) {
        console.error('Error on getByUserId doctor service: ', error);
        throw error;
    }
}

async function dashDetails(id) {
    try {
        if (!id) throw 'id missing';

        const dashDetails = {};

        const today = moment().utc();

        let bookingQuery = {
            doctorId: id,
            from: {
                $gte: today.startOf('d').toDate(),
                $lte: today.endOf('d').toDate(),
            },
            active: true,
            status: { $nin: ['Cancelled'] },
        };

        let doctorBookings = await Booking.find(bookingQuery).lean();

        dashDetails.todayBookings = doctorBookings.length;
        dashDetails.nextBookingStart = (doctorBookings.length && doctorBookings[0].from) || null;

        bookingQuery = {
            doctorId: id,
            from: {
                $gte: today.toDate(),
                $lte: today.add(24, 'hours').toDate(),
            },
            active: true,
            status: { $nin: ['Cancelled'] },
        };

        doctorBookings = await Booking.find(bookingQuery).lean();

        dashDetails.upcoming24H = doctorBookings.length;

        bookingQuery = {
            doctorId: id,
            from: {
                $gte: today.toDate(),
                $lte: today.add('1', 'weeks').toDate(),
            },
            active: true,
            status: { $nin: ['Cancelled'] },
        };

        doctorBookings = await Booking.find(bookingQuery).lean();

        dashDetails.upcoming1W = doctorBookings.length;

        bookingQuery = {
            doctorId: id,
            from: {
                $gte: today.toDate(),
                $lte: today.add('2', 'weeks').toDate(),
            },
            active: true,
            status: { $nin: ['Cancelled'] },
        };

        doctorBookings = await Booking.find(bookingQuery).lean();

        dashDetails.upcoming2W = doctorBookings.length;

        return dashDetails;
    } catch (error) {
        console.error('Error on dashDetails doctor service: ', error);
        throw error;
    }
}
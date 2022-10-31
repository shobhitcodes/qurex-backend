'use strict';

const { defaultDoctorBusinessHours } = require('../constants/businessHours');

// model imports
const DoctorDetail = require('../models/doctorDetail');

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

        const doctor = await DoctorDetail.findOne({ userId: id });
        console.log({ doctor });
        return doctor;
    } catch (err) {
        console.error('Error on getById doctor service: ', err);
        throw err;
    }
}

async function getAll() {
    try {
        const doctors = await DoctorDetail.find();
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
        console.error('Error on create doctor service: ', err);
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

        console.log({ doctor });
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

        const availableSlots = [];

        // today date
        // next 7 days
        // each date get available by day
        // from booking fetch all booking for 7 days
        // reduce available slots cosiudering bookings

        // today = Date()

        // console.log({ availableSlots });

        // 2 pm  - 4 pm
        // 30mins

        // availableSlots
        // 2- 4

        // 2nd 2:00 2:15 2:30 2:45

        // [ mon
        //     12 - 2:30
        //     6 7:30

        // ]

        // 31  45
        // 3:00 - 3:45
        // 6:00 - 6:45

        // 31 - 2-4
        // 1 -
        // 2
        // 3
        // 4
        // 5

        // 2-4

        // 2nd 2:00 2:15 2:30 2:45

        // 2:15 - 2:45

        // 12 -1 1:15 1:30
        return availableSlots;
    } catch (err) {
        console.error('Error on verify doctor service: ', err);
        throw err;
    }
}

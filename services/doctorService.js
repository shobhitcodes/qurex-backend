'use strict';

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

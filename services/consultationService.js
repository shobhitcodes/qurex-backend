'use strict';

// model imports
const Consultation = require('../models/consultation');

// public interface
module.exports.getById = getById;
module.exports.getByUserId = getByUserId;
module.exports.getAll = getAll;
module.exports.create = create;
module.exports.update = update;
module.exports.deleteOne = deleteOne;

async function getById(id) {
    try {
        if (!id) throw 'id missing';

        const consultation = await Consultation.findById(id);
        return consultation;
    } catch (err) {
        console.error('Error on getById consultation service: ', err);
        throw err;
    }
}

async function getByUserId(id) {
    try {
        if (!id) throw 'id missing';

        const consultations = await Consultation.findOne({
            $or: { patientId: id, doctorId: id },
        });
        return consultations;
    } catch (err) {
        console.error('Error on getByUserId consultation service: ', err);
        throw err;
    }
}

async function getAll() {
    try {
        const consultations = await Consultation.find();
        return consultations;
    } catch (err) {
        console.error('Error on getAll consultation service: ', err);
        throw err;
    }
}

async function create(consultation) {
    try {
        if (!consultation) throw 'data missing';

        consultation = new Consultation(consultation);
        consultation = await consultation.save();

        return consultation;
    } catch (err) {
        console.error('Error on create consultation service: ', err);
        throw err;
    }
}

async function update(id, consultation) {
    try {
        if (!id || !consultation) throw 'required data missing';

        consultation = await Consultation.findByIdAndUpdate(id, doctor, {
            new: true,
        });

        if (!consultation) throw 'consultation not found';

        return consultation;
    } catch (err) {
        console.error('Error on create consultation service: ', err);
        throw err;
    }
}

async function deleteOne(id) {
    try {
        if (!id) throw 'id missing';

        return await Consultation.findByIdAndDelete(id);
    } catch (err) {
        console.error('Error on deleteOne consultation service: ', err);
        throw err;
    }
}
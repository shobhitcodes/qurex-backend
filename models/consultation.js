'use strict';

const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const consultationSchema = new Schema(
    {
        consultationId: String, // custom id
        bookingId: String, // custom id
        patientId: { type: mongoose.Types.ObjectId, ref: user },
        doctorId: { type: mongoose.Types.ObjectId, ref: user },
        meta: String,
        issue: String,
        diagnosis: String,
        medicine: String,
        frequency: String,
        labTests: [String],
        doctorAdvice: String,
        status: String,
        notes: String,
        since: String,
    },
    { timestamps: true, collection: 'consultation' }
);

module.exports = mongoose.model('Consultation', consultationSchema);

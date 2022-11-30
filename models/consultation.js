'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationSchema = new Schema(
    {
        consultationId: String, // custom id
        bookingId: String, // custom id
        patientId: String,
        doctorId: String,
        meta: String,
        issue: String,
        diagnosis: String,
        medicine: String,
        frequency: String,
        labTests: [String],
        doctorAdvice: String,
        status: String,
        notes: String,
    },
    { timestamps: true, collection: 'consultation' }
);

module.exports = mongoose.model('Consultation', consultationSchema);

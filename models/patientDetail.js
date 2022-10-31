'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientDetailSchema = new Schema(
    {
        userId: String,
        dob: Date,
        weight: Number,
        height: Number,
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        chronicDisease: String,
        chronicMeds: String,
        allergies: String,
        sexActive: Boolean,
        coursesBrought: [String],
    },
    { timestamps: true, collection: 'patient_detail' }
);

module.exports = mongoose.model('PatientDetail', patientDetailSchema);

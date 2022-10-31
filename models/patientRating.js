'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientRatingSchema = new Schema(
    {
        patientId: String,
        doctorId: String,
        rating: Number,
    },
    { timestamps: true, collection: 'patient_rating' }
);

module.exports = mongoose.model('PatientRating', patientRatingSchema);

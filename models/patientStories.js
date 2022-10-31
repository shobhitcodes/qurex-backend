'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientStorySchema = new Schema(
    {
        patientId: String,
        doctorId: String,
        description: String,
        likes: Number,
    },
    { timestamps: true, collection: 'patient_story' }
);

module.exports = mongoose.model('PatientStory', patientStorySchema);

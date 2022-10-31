'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
    {
        patientId: { type: String },
        doctorId: { type: String },
        bookingId: { type: String },
        channelName: { type: String },
        startTime: Date,
        endTime: Date,
        expectedDuration: Number, // in mins doctor session
        actualDuration: Number,
        bumpUp: { type: Number, default: 0 },
        activationTime: Date,
    },
    { timestamps: true, collection: 'session' }
);

module.exports = mongoose.model('Session', sessionSchema);

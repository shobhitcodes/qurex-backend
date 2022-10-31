'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

// sub schemas
const professionalDetail = {
    degree: String,
    treatments: [String],
    specializations: [String],
    treatmentRendered: {
        type: String,
        enum: ['Men', 'Women', 'Both men and women'],
    },
    about: String,
};

const education = {
    degree: String,
    institution: String,
    year: Number,
};

const experience = {
    hospitalName: String,
    from: Date,
    to: Date,
    designation: String,
};

const accountDetail = {
    number: String,
    bank: String,
    ifsc: String,
    holderName: String,
};

const awards = {
    name: String,
    year: Number,
};

const affiliation = {
    membership: String,
    year: Number,
};

const availableSlots = {
    from: String,
    to: String,
};

const blockSlots = {
    from: Date,
    to: Date,
};

const businessHours = {
    day: String,
    slots: [availableSlots],
};

const doctorDetailSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        professionalDetail,
        education: [education],
        experience: [experience],
        awards: [awards],
        affiliation: [affiliation],
        accountDetail,
        satisfactionCount: Number,
        punctualCount: Number,
        rating: Number,
        blockSlots,
        consultationCount: Number,
        moneyStats: {
            earning: Number,
            loss: Number,
        },
        // consultationStats: {
        //     finish: Number,
        //     remaning: Number,
        //     missed: Number,
        // },
        feeCharge: Number,
        sessionDuration: Number, // in mins
        verified: { type: Boolean, default: false },
        businessHours: [businessHours],
    },
    { timestamps: true, collection: 'doctor_detail' }
);

module.exports = mongoose.model('DoctorDetail', doctorDetailSchema);

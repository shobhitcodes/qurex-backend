'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema(
    {
        name: { type: String },
    },
    { timestamps: true, collection: 'course' }
);

module.exports = mongoose.model('Course', courseSchema);


// transaction status

// payment fgateway -> ui
// returnUrl  

// server api

// couseBuy
// patientId
// courseId

// patient courses


// booking 


// transaction


// course
// booking
// paymnetgateway




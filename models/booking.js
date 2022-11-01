'use strict';

const mongoose = require('mongoose');
const user = require('./user');
const payment = require('./payment');
const Schema = mongoose.Schema;

// const bookingStatus = ['PendingConfirmation', 'Confirm', 'Cancelled', 'Completed'];


const bookingSchema = new Schema(
    {
        bookingId: String, // custom id
        patientId: { type: mongoose.Types.ObjectId, ref: user },
        doctorId: { type: mongoose.Types.ObjectId, ref: user },
        meta: String,
        from: Date,
        to: Date,
        fees: Number,
        isPaid: { type: Boolean, default: false },
        payment: {
            razorPayPaymentId: String,
            razorPayOrderId: String,
        },
        status: { type: String, enum: ['PendingConfirmation', 'Confirm', 'Cancelled', 'Completed'], default: 'PendingConfirmation' },
        active: { type: Boolean, default: true },
    },
    { timestamps: true, collection: 'booking' }
);

bookingSchema.pre('save', function (next) {
	this.bookingId = 'BK_' + Math.floor(100000 + Math.random() * 900000);
	next();
});

module.exports = mongoose.model('Booking', bookingSchema);

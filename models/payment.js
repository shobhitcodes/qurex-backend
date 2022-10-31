'use strict';

const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        userid: { type: mongoose.Types.ObjectId, ref: user },
        paymentDetailId: { type: String },
        receipt: { type: String },
        currentStep: { type: String },
        razorPayOrderId: { type: String },
        amount: { type: Number },
        currency: { type: String },
        notes: [{ type: String }],
        prefillName: { type: String },
        prefillContact: { type: String },
        prefillEmail: { type: String },
        razorPayPaymentId: { type: String },
        razorPaySignature: { type: String },
        status: { type: String, enum: ['success', 'failed', 'pending'] },
        isVerified: { type: Boolean, default: false },
        isSuccess: { type: Boolean },
        isFailed: { type: Boolean },
        active: { type: Boolean, default: true },
        failError: { type: Schema.Types.Mixed },
        isDisputed: { type: Boolean, default: false }, // to be discussed
        disputeReason: { type: String },
    },
    { timestamps: true, collection: 'payment' }
)

module.exports = mongoose.model('Payment', paymentSchema);

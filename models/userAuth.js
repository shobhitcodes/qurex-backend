'use strict';
const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const userAuthSchema = new Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: user },
        otpUsed: { type: Boolean, default: false },
        otp: String,
        mobileNo: String,
        otpType: { type: String, enum: ['Login', 'PasswordChange'], default: 'Login' },
        active: { type: Boolean, default: true }
    },
    { timestamps: true, collection: 'userAuth' }
)
module.exports = mongoose.model('UserAuth', userAuthSchema);

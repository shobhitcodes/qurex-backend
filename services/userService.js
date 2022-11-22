'use strict';

const bcrypt = require('bcrypt');
let ejs = require('ejs');
const jwt = require('jsonwebtoken');
const path = require('path');
const doctorService = require('./doctorService');

// model imports
const User = require('../models/user');
const mailer = require('./mail.service');
const axios = require('axios');
const userAuth = require('../models/userAuth');

// public interface
module.exports.register = register;
module.exports.auth = auth;
module.exports.update = update;
module.exports.getUserById = getUserById;
module.exports.getAllPatients = getAllPatients;
module.exports.getAllDoctors = getAllDoctors;
module.exports.changePassword = changePassword;
module.exports.forgotPassword = forgotPassword;
module.exports.generateOTP = generateOTP;
module.exports.resendOTP = resendOTP;
module.exports.loginViaOTP = loginViaOTP;
module.exports.getById = getById;
module.exports.generateSignUpOTP = generateSignUpOTP;
module.exports.signUpViaOTP = signUpViaOTP;

/**
 * @async
 * @description registers user
 * @param {*} name
 * @param {*} email
 * @param {*} password
 * @returns
 */
async function register(name, email, password, mobile, role = 'patient') {
    try {
        // email check
        let emailFound = email && (await User.findOne({ email }));
        let mobileFound = mobile && (await User.findOne({ mobile }));

        if (emailFound || mobileFound) throw 'User already registered';

        // creating new user
        let user = new User({
            name,
            email,
            password,
            mobile,
            role,
        });

        user.password = await bcrypt.hash(user.password, 10);

        user = await user.save();

        if (role === 'doctor') {
            await doctorService.create({ userId: user._id });
        }

        delete user.password;
        // // take out password before returning
        // const { password: remove, ...restUser } = user;
        return user;
    } catch (err) {
        console.error('Error on register service: ', err);
        throw err;
    }
}

/**
 * @async
 * @param {*} email
 * @param {*} password
 */
async function auth(mobile, password) {
    try {
        let user = await User.findOne({ mobile, active: true });
        console.log({ user });
        if (!user) throw 'Invalid email or password';

        const validPass = await bcrypt.compare(password, user.password);
        console.log({ validPass });

        if (!validPass) throw 'Invalid email or password';

        return user;
    } catch (err) {
        console.error('Error on login service: ', err);
        throw err;
    }
}

async function generateSignUpOTP(mobile, email, name, role = 'patient') {
    try {
        let emailFound = email && (await User.findOne({ email }));
        let mobileFound = mobile && (await User.findOne({ mobile }));

        if (emailFound || mobileFound) throw 'User already registered';

        let otp = parseInt(Math.random() * 10000) + '';

        if (otp.length < 4) {
            otp = '0' + otp;
        }

        await userAuth.create({
            otpUsed: true,
            otp: otp,
            otpType: 'register',
            mobileNo: mobile,
            meta: { name, email, role },
        });

        let template = 'otp-registration';

        await sendOTP(mobile, otp, template);

        return true;
    } catch (err) {
        console.error('Error on generateSignUpOTP service: ', err);
        throw err;
    }
}

async function generateOTP(mobileNo, type = 'Login') {
    try {
        let user = await User.findOne({ mobile: mobileNo });
        if (!user) throw 'Invalid mobile number';

        let otp = parseInt(Math.random() * 10000) + '';

        if (otp.length < 4) {
            otp = '0' + otp;
        }

        const _userAuth = await userAuth.create({
            userId: user._id,
            otpUsed: true,
            otp: otp,
            otpType: type,
            mobileNo,
        });

        let template = '';
        if (type === 'Login') {
            template = 'OTP%20Login';
        }
        if (type === 'PasswordChange') {
            template = 'Password%20Reset%20OTP';
        }
        const isOTPSend = await sendOTP(user.mobile, otp, template);
        return true;
    } catch (error) {
        console.error('Error on login service: ', error);
        throw error;
    }
}

async function resendOTP(mobileNo) {
    try {
        const _userAuth = await userAuth
            .find({ mobileNo })
            .sort({ _id: -1 })
            .limit(1);
        if (!userAuth) throw 'Invalid Mobile Number';
        const isOTPSend = await sendOTP(
            mobileNo,
            _userAuth[0].otp,
            'OTP%20Login'
        );
        return isOTPSend;
    } catch (error) {
        console.error('Error on login service: ', error);
        throw error;
    }
}

async function sendOTP(mobileNo, otp, template) {
    try {
        const url = `https://2factor.in/API/V1/9e6e3742-1fff-11ec-a13b-0200cd936042/SMS/+91${mobileNo}/${otp}/${template}`;
        const otpResponse = await axios.get(url);
        if (otpResponse.status === 200) {
            return true;
        } else throw otpResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function loginViaOTP(otp, mobileNo) {
    try {
        const _userAuth = await userAuth
            .find({ mobileNo, active: true, otpType: 'Login' })
            .sort({ _id: -1 })
            .limit(1);
        if (!_userAuth) throw 'Invalid Mobile Number Or OTP';
        if (!_userAuth[0]) throw 'Invalid Mobile Number Or OTP';
        if (_userAuth[0].otp !== otp) throw 'Invalid OTP';

        await userAuth.updateOne({ _id: _userAuth[0]._id }, { active: false });

        const user = await User.findOne({ mobile: mobileNo, active: true });
        if (!user) throw 'Invalid User';
        delete user.password;
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function signUpViaOTP(otp, mobile) {
    try {
        const _userAuth = await userAuth
            .find({ mobileNo: mobile, active: true, otpType: 'register' })
            .sort({ _id: -1 })
            .limit(1);

        if (!_userAuth) throw 'Invalid Mobile Number Or OTP';
        if (!_userAuth[0]) throw 'Invalid Mobile Number Or OTP';
        if (_userAuth[0].otp !== otp) throw 'Invalid OTP';

        await userAuth.updateOne({ _id: _userAuth[0]._id }, { active: false });

        // creating new user
        let user = new User({
            mobile,
            ..._userAuth.meta,
        });

        user = await user.save();

        if (user.role === 'doctor') {
            await doctorService.create({ userId: user._id });
        }

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * @async
 * @param {*} userId
 */
async function getUserById(userId) {
    try {
        if (!userId) throw 'userId missing';

        const user = await User.findById(userId).select('-password');
        return user;
    } catch (err) {
        console.error('Error on getUserById service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description get All Patients for admin
 */
async function getAllPatients(limit, offset) {
    try {
        const users = await User.find({
            role: 'patient',
            active: true,
        })
            .select('-password')
            .sort({ _id: -1 })
            .limit(limit)
            .skip(offset);

        return users;
    } catch (err) {
        console.error('Error on User service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description get All Doctors for admin
 */
async function getAllDoctors(limit, offset) {
    try {
        const users = await User.find({
            role: 'doctor',
            active: true,
        })
            .select('-password')
            .sort({ _id: -1 })
            .limit(limit)
            .skip(offset);

        return users;
    } catch (err) {
        console.error('Error on User service: ', err);
        throw err;
    }
}

async function forgotPassword(mobile) {
    try {
        const user = await User.findOne({ mobile, active: true });
        if (!user) throw 'Invalid Mobile Number';
        return generateOTP(mobile, 'PasswordChange');
    } catch (error) {
        console.error('Error on User service: ', error);
        throw error;
    }
}

async function changePassword(mobileNo, otp, newPassword) {
    try {
        const otpAuth = await userAuth.find({
            mobileNo,
            otpType: 'PasswordChange',
            active: true,
        });

        if (!otpAuth) throw 'Invalid Mobile Number Or OTP';
        if (!otpAuth[0]) throw 'Invalid Mobile Number Or OTP';
        if (otpAuth[0].otp !== otp) throw 'Invalid OTP';

        otpAuth[0].active = false;
        otpAuth[0].save();
        const user = await User.findOne({ mobile: mobileNo, active: true });
        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();
        return true;
    } catch (error) {
        console.error('Error on User service: ', error);
        throw error;
    }
}

async function update(id, user) {
    try {
        if (!id || !user) throw 'required data missing';

        user = await User.findByIdAndUpdate(id, user, {
            new: true,
        });

        if (!user) throw 'user not found';

        console.log({ user });
        return user;
    } catch (err) {
        console.error('Error on update user service: ', err);
        throw err;
    }
}

async function getById(id) {
    try {
        if (!id) throw 'id missing';

        const user = await User.findById(id);
        return user;
    } catch (err) {
        console.error('Error on getById user service: ', err);
        throw err;
    }
}

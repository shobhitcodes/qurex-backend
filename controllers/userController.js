'use strict';

const utils = require('../helpers/utils');
const userService = require('../services/userService');
const user = require('../models/user');

// public interface
module.exports.register = register;
module.exports.auth = auth;
module.exports.generateOTP = generateOTP;
module.exports.loginViaOTP = loginViaOTP;
module.exports.resendOTP = resendOTP;
module.exports.forgotPass = forgotPass;
module.exports.changePassword = changePassword;
module.exports.getCurrentUser = getCurrentUser;
module.exports.getAllPatients = getAllPatients;
module.exports.getAllDoctors = getAllDoctors;
module.exports.update = update;
module.exports.getById = getById;
module.exports.generateSignUpOTP = generateSignUpOTP;
module.exports.signUpViaOTP = signUpViaOTP;


/**
 * @async
 * @description Request handler for registering user
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function register(req, res) {
    try {
        const { name, email, password, mobile, role } = req.body;
        const user = await userService.register(name, email, password, mobile, role);
        const token = user.generateAuthToken();
        res.header('x-auth-token', token);
        res.json(utils.formatResponse(1, user._id));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for user login
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function auth(req, res) {
    try {
        const { mobile, email, password } = req.body;
        const user = await userService.auth(mobile, email, password);
        const token = user.generateAuthToken();
        res.header('x-auth-token', token);
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for user login verification
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function generateOTP(req, res) {
    try {
        const { mobileNo } = req.body;
        const otpGenerated = await userService.generateOTP(mobileNo);
        res.json(utils.formatResponse(1, otpGenerated));
    } catch (err) {
        console.error('Error on login handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function generateSignUpOTP(req, res) {
    try {
        const { mobile, email, name, role } = req.body;
        const otpGenerated = await userService.generateSignUpOTP(mobile, email, name, role);
        res.json(utils.formatResponse(1, otpGenerated));
    } catch (err) {
        console.error('Error on generateSignUpOTP handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for user login verification
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function loginViaOTP(req, res) {
    try {
        const { mobileNo, otp } = req.body;
        const user = await userService.loginViaOTP(otp, mobileNo);
        const token = user.generateAuthToken();
        res.header('x-auth-token', token);
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on login handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function signUpViaOTP(req, res) {
    try {
        const { mobile, otp } = req.body;
        const user = await userService.signUpViaOTP(otp, mobile);
        const token = user.generateAuthToken();
        res.header('x-auth-token', token);
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on generateSignUpOTP handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for user login otp verification
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function resendOTP(req, res) {
    try {
        const { mobileNo } = req.body;
        const otpGenerated = await userService.resendOTP(mobileNo);
        res.json(utils.formatResponse(1, otpGenerated));

    } catch (err) {
        console.error('Error on login handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for resetting user pass
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function forgotPass(req, res) {
    try {
        const mobile = req.body.mobile;
        const forgotPassVal = await userService.forgotPassword(mobile)
        res.json(utils.formatResponse(1, forgotPassVal));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function changePassword(req, res) {
    try {
        const { mobile, otp, newPassword } = req.body;

        const newPasswordSaved = await userService.changePassword(mobile, otp, newPassword)
        res.json(utils.formatResponse(1, newPasswordSaved));
    } catch (err) {
        console.error('Error on register handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching current user
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getCurrentUser(req, res) {
    try {
        const { _id: id } = req.user;
        // const { _id: userId } = req.body;
        const user = await userService.getUserById(id);
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on getCurrentUser handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching current user
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllDoctors(req, res) {
    try {
        const { limit, offset } = req.query;
        const users = await userService.getAllDoctors(limit || 100, offset || 0);
        res.json(utils.formatResponse(1, users));
    } catch (err) {
        console.error('Error on get All Doctors handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching current user
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllPatients(req, res) {
    try {
        const { limit, offset } = req.query;
        const users = await userService.getAllPatients(limit || 100, offset || 0);
        res.json(utils.formatResponse(1, users));
    } catch (err) {
        console.error('Error on getCurrentUser handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        let user = req.body;
        user = await userService.update(id, user);
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on user update handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function getById(req, res) {
    try {
        const { id } = req.params;
        const user = await userService.getById(id);
        res.json(utils.formatResponse(1, user));
    } catch (err) {
        console.error('Error on user getById handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}


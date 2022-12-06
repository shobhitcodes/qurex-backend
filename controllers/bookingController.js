'use strict';

const utils = require('../helpers/utils');
const bookingService = require('../services/booking.service');

// public interface
module.exports.update = update;
module.exports.cancel = cancel;

/**
 * @async
 * @description Request handler for update consultation
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function update(req, res) {
    try {
        const { id } = req.params;
        let booking = req.body;
        booking = await bookingService.update(id, booking);
        res.json(utils.formatResponse(1, booking));
    } catch (err) {
        console.error('Error on booking update handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

async function cancel(req, res) {
    try {
        const { id } = req.params;
        await bookingService.cancel(id);
        res.json(utils.formatResponse(1));
    } catch (err) {
        console.error('Error on booking cancel handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

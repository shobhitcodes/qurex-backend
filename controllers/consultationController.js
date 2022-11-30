'use strict';

const utils = require('../helpers/utils');
const consultationService = require('../services/consultationService');

// public interface
module.exports.getById = getById;
module.exports.getByUserId = getByUserId;
module.exports.getAll = getAll;
module.exports.create = create;
module.exports.update = update;
module.exports.deleteOne = deleteOne;

/**
 * @async
 * @description Request handler for fetching consultations
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAll(req, res) {
    try {
        const consultations = await consultationService.getAll();
        res.json(utils.formatResponse(1, consultations));
    } catch (err) {
        console.error('Error on consultation getAll handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching consultation
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getById(req, res) {
    try {
        const { id } = req.params;
        const consultation = await consultationService.get(id);
        res.json(utils.formatResponse(1, consultation));
    } catch (err) {
        console.error('Error on consultation getById handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for fetching consultations by userId
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getByUserId(req, res) {
    try {
        const { id } = req.params;
        const consultations = await consultationService.getByUserId(id);
        res.json(utils.formatResponse(1, consultations));
    } catch (err) {
        console.error('Error on consultation getByUserId handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for create consultation
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function create(req, res) {
    try {
        const data = req.body;
        const consultation = await consultationService.create(data);
        res.json(utils.formatResponse(1, consultation));
    } catch (err) {
        console.error('Error on consultation create handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for update consultation
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function update(req, res) {
    try {
        const { id } = req.params;
        let consultation = req.body;
        consultation = await consultationService.update(id, consultation);
        res.json(utils.formatResponse(1, consultation));
    } catch (err) {
        console.error('Error on consultation update handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for delete consultation
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function deleteOne(req, res) {
    try {
        const { id } = req.params;
        await consultationService.deleteOne(id);
        res.json(utils.formatResponse(1));
    } catch (err) {
        console.error('Error on consultation deleteOne handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
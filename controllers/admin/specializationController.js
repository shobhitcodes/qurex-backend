'use strict';

const utils = require('../../helpers/utils');
const specializationService = require('../../services/specializations.service');
module.exports.getAllSpecializations = getAllSpecializations;
module.exports.addNewSpecialization = addNewSpecialization;
module.exports.updateSpecialization = updateSpecialization;
module.exports.bulkAddSpecializations = bulkAddSpecializations;
module.exports.removeSpecialization = removeSpecialization;

/**
 * @async
 * @description Request handler for getting all Specialization
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllSpecializations(req, res) {
    try {
        const specialization = await specializationService.getAllSpecializations()
        res.json(utils.formatResponse(1, specialization));
    } catch (err) {
        console.error('Error on Specialization handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding new specialization
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function addNewSpecialization(req, res) {
    try {
        const {name, imageUrl, description} = req.body;
        const specialization = await specializationService.addNewSpecialization(name, imageUrl, description)
        res.json(utils.formatResponse(1, specialization));
    } catch (err) {
        console.error('Error on Specialization handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for update specialization
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function updateSpecialization(req, res) {
    try {
        const {name, imageUrl, description} = req.body;
        const id = req.params.id;
        const specialization = await specializationService.updateSpecialization(id,name, imageUrl, description)
        res.json(utils.formatResponse(1, specialization));
    } catch (err) {
        console.error('Error on Specialization handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding bulk Specialization
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function bulkAddSpecializations(req, res) {
    try {
        const names = req.body.names;
        const specializations = await specializationService.addNewSpecializations(names)
        res.json(utils.formatResponse(1, specializations));
    } catch (err) {
        console.error('Error on Specialization handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}


/**
 * @async
 * @description Request handler for removing one specialization
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function removeSpecialization(req, res) {
    try {
        const id = req.params.id;
        const specialization = await specializationService.removeSpecialization(id)
        res.json(utils.formatResponse(1, specialization));
    } catch (err) {
        console.error('Error on Specialization handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

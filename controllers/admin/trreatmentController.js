'use strict';

const utils = require('../../helpers/utils');
const treatmentService = require('../../services/treatment.service');
module.exports.getAllTreatments = getAllTreatments;
module.exports.addNewTreatment = addNewTreatment;
module.exports.updateTreatment = updateTreatment;
module.exports.bulkAddTreatments = bulkAddTreatments;
module.exports.removeTreatment = removeTreatment;

/**
 * @async
 * @description Request handler for getting all Treatments
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllTreatments(req, res) {
    try {
        const treatments = await treatmentService.getAllTreatments()
        res.json(utils.formatResponse(1, treatments));
    } catch (err) {
        console.error('Error on Treatments handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding new treatment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function addNewTreatment(req, res) {
    try {
        const {name, imageUrl, gender, category, description} = req.body;
        const treatment = await treatmentService.addNewTreatment(name, imageUrl,description, gender, category)
        res.json(utils.formatResponse(1, treatment));
    } catch (err) {
        console.error('Error on Treatments handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding new treatment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function updateTreatment(req, res) {
    try {
        const {name, imageUrl, gender, category, description} = req.body;
        const id = req.params.id;
        const treatment = await treatmentService.updateTreatment(id, name, imageUrl,description, gender, category)
        res.json(utils.formatResponse(1, treatment));
    } catch (err) {
        console.error('Error on Treatments handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding bulk treatments
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function bulkAddTreatments(req, res) {
    try {
        const names = req.body.names;
        const treatments = await treatmentService.addNewTreatments(names)
        res.json(utils.formatResponse(1, treatments));
    } catch (err) {
        console.error('Error on Treatments handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}


/**
 * @async
 * @description Request handler for removing one treatment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function removeTreatment(req, res) {
    try {
        const id = req.params.id;
        const treatment = await treatmentService.removeTreatment(id)
        res.json(utils.formatResponse(1, treatment));
    } catch (err) {
        console.error('Error on Treatments handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

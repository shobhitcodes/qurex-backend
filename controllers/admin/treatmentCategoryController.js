'use strict';

const utils = require('../../helpers/utils');
const treatmentCategoryService = require('../../services/treatmentCategory.service');
module.exports.getAllTreatmentCategories = getAllTreatmentCategories;
module.exports.addNewTreatmentCategory = addNewTreatmentCategory;
module.exports.updateTreatmentCategory = updateTreatmentCategory;
module.exports.removeTreatmentCategory = removeTreatmentCategory;

/**
 * @async
 * @description Request handler for getting all TreatmentCategories
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllTreatmentCategories(req, res) {
    try {
        const treatments = await treatmentCategoryService.getAllTreatmentCategories()
        res.json(utils.formatResponse(1, treatments));
    } catch (err) {
        console.error('Error on TreatmentCategory handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding new treatment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function addNewTreatmentCategory(req, res) {
    try {
        const {name, imageUrl, description} = req.body;
        const treatment = await treatmentCategoryService.addNewTreatmentCategory(name, imageUrl,description)
        res.json(utils.formatResponse(1, treatment));
    } catch (err) {
        console.error('Error on TreatmentCategory handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for adding new treatment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function updateTreatmentCategory(req, res) {
    try {
        const {name, imageUrl, description} = req.body;
        const id = req.params.id;
        const treatment = await treatmentCategoryService.updateTreatmentCategory(id, name, imageUrl,description)
        res.json(utils.formatResponse(1, treatment));
    } catch (err) {
        console.error('Error on TreatmentCategory handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}




/**
 * @async
 * @description Request handler for removing one treatment
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function removeTreatmentCategory(req, res) {
    try {
        const id = req.params.id;
        const treatment = await treatmentCategoryService.removeTreatmentCategory(id)
        res.json(utils.formatResponse(1, treatment));
    } catch (err) {
        console.error('Error on TreatmentCategory handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

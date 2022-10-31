'use strict';

const utils = require('../../helpers/utils');
const systemOfMedicineService = require('../../services/systemOfMedicine.service');
module.exports.getAll = getAll;
module.exports.addNewSystemOfMedicine = addNewSystemOfMedicine;
module.exports.updateSystemOfMedicine = updateSystemOfMedicine;
module.exports.removeSystemOfMedicine = removeSystemOfMedicine;

/**
 * @async
 * @description Request handler for getting all systemOfMedicines
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAll(req, res) {
    try {
        const systemOfMedicines = await systemOfMedicineService.getAllSystemOfMedicines()
        res.json(utils.formatResponse(1, systemOfMedicines));
    } catch (err) {
        console.error('Error on Cities handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding new systemOfMedicine
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function addNewSystemOfMedicine(req, res) {
    try {
        const name = req.body.name;
        const systemOfMedicine = await systemOfMedicineService.addNewSystemOfMedicine(name)
        res.json(utils.formatResponse(1, systemOfMedicine));
    } catch (err) {
        console.error('Error on Cities handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}


/**
 * @async
 * @description Request handler for update module
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
 async function updateSystemOfMedicine(req, res) {
    try {
        const name = req.body.name;
        const id = req.params.id;
        const systemOfMedicine = await systemOfMedicineService.updateSystemOfMedicine(id,name)
        res.json(utils.formatResponse(1, systemOfMedicine));
    } catch (err) {
        console.error('Error on Modules handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}



/**
 * @async
 * @description Request handler for removing one systemOfMedicine
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function removeSystemOfMedicine(req, res) {
    try {
        const id = req.params.id;
        const systemOfMedicine = await systemOfMedicineService.removeSystemOfMedicine(id)
        res.json(utils.formatResponse(1, systemOfMedicine));
    } catch (err) {
        console.error('Error on Cities handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

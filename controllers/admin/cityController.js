'use strict';

const utils = require('../../helpers/utils');
const cityService = require('../../services/city.service');
module.exports.getAll = getAll;
module.exports.addNewCity = addNewCity;
module.exports.updateCity = updateCity;
module.exports.bulkAddCity = bulkAddCity;
module.exports.removeCity = removeCity;

/**
 * @async
 * @description Request handler for getting all cities
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAll(req, res) {
    try {
        const cities = await cityService.getAllCities()
        res.json(utils.formatResponse(1, cities));
    } catch (err) {
        console.error('Error on Cities handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding new city
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function addNewCity(req, res) {
    try {
        const name = req.body.name;
        const city = await cityService.addNewCity(name)
        res.json(utils.formatResponse(1, city));
    } catch (err) {
        console.error('Error on Cities handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for adding new city
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function updateCity(req, res) {
    try {
        const name = req.body.name;
        const id = req.params.id;
        const city = await cityService.updateCity(id,name)
        res.json(utils.formatResponse(1, city));
    } catch (err) {
        console.error('Error on Cities handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding bulk cities
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function bulkAddCity(req, res) {
    try {
        const names = req.body.names;
        const city = await cityService.addNewCities(names)
        res.json(utils.formatResponse(1, city));
    } catch (err) {
        console.error('Error on Cities handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}


/**
 * @async
 * @description Request handler for removing one city
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function removeCity(req, res) {
    try {
        const id = req.params.id;
        const city = await cityService.removeCity(id)
        res.json(utils.formatResponse(1, city));
    } catch (err) {
        console.error('Error on Cities handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

'use strict';

const utils = require('../../helpers/utils');
const moduleService = require('../../services/module.service');
module.exports.getAllModules = getAllModules;
module.exports.addNewModule = addNewModule;
module.exports.updateModule = updateModule;
module.exports.bulkAddModules = bulkAddModules;
module.exports.removeModule = removeModule;

/**
 * @async
 * @description Request handler for getting all modules
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAllModules(req, res) {
    try {
        const _modules = await moduleService.getAllModules()
        res.json(utils.formatResponse(1, _modules));
    } catch (err) {
        console.error('Error on Modules handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding new module
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function addNewModule(req, res) {
    try {
        const name = req.body.name;
        const _module = await moduleService.addNewModule(name)
        res.json(utils.formatResponse(1, _module));
    } catch (err) {
        console.error('Error on Modules handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}
/**
 * @async
 * @description Request handler for adding new module
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function updateModule(req, res) {
    try {
        const name = req.body.name;
        const id = req.params.id;
        const _module = await moduleService.updateModule(id,name)
        res.json(utils.formatResponse(1, _module));
    } catch (err) {
        console.error('Error on Modules handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding bulk modules
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function bulkAddModules(req, res) {
    try {
        const names = req.body.names;
        const _modules = await moduleService.addNewModules(names)
        res.json(utils.formatResponse(1, _modules));
    } catch (err) {
        console.error('Error on Modules handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}


/**
 * @async
 * @description Request handler for removing one module
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function removeModule(req, res) {
    try {
        const id = req.params.id;
        const _module = await moduleService.removeModule(id)
        res.json(utils.formatResponse(1, _module));
    } catch (err) {
        console.error('Error on Modules handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

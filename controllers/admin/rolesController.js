'use strict';

const utils = require('../../helpers/utils');
const roleService = require('../../services/roles.service');
module.exports.getAll = getAll;
module.exports.addNewRole = addNewRole;
module.exports.updateRole = updateRole;
module.exports.bulkAddRole = bulkAddRole;
module.exports.removeRole = removeRole;

/**
 * @async
 * @description Request handler for getting all roles
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getAll(req, res) {
    try {
        const roles = await roleService.getAllRoles()
        res.json(utils.formatResponse(1, roles));
    } catch (err) {
        console.error('Error on Roles handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding new roles
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function addNewRole(req, res) {
    try {
        const {name, access} = req.body;

        const role = await roleService.addNewRole(name, access)
        res.json(utils.formatResponse(1, role));
    } catch (err) {
        console.error('Error on Roles handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding new roles
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function updateRole(req, res) {
    try {
        const {name, access} = req.body;
        const id = req.params.id;

        const role = await roleService.updateRole(id,name, access)
        res.json(utils.formatResponse(1, role));
    } catch (err) {
        console.error('Error on Roles handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

/**
 * @async
 * @description Request handler for adding bulk roles
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function bulkAddRole(req, res) {
    try {
        const roles = req.body.roles;
        const bulkCreated = await roleService.addNewRoles(roles)
        res.json(utils.formatResponse(1, bulkCreated));
    } catch (err) {
        console.error('Error on Roles handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}


/**
 * @async
 * @description Request handler for removing one roles
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function removeRole(req, res) {
    try {
        const id = req.params.id;
        const role = await roleService.removeRole(id)
        res.json(utils.formatResponse(1, role));
    } catch (err) {
        console.error('Error on Roles handler: ', err);
        res.json(utils.formatResponse(0, err));
    }
}

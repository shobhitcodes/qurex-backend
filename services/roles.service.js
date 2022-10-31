const moment = require('moment');
const Roles = require('../models/roles');

module.exports.getAllRoles = getAllRoles;
module.exports.addNewRole = addNewRole;
module.exports.updateRole = updateRole;
module.exports.addNewRoles = addNewRoles;
module.exports.removeRole = removeRole;

/**
 * @async
 * @description get All Roles
 * @returns
 */
async function getAllRoles() {
    try {
        const roles = await Roles.find({
            active: true
        }).populate('access.module')
        return roles;
    } catch (err) {
        console.error('Error on Role service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description add New Role
 * @param {*} name
 * @returns
 */
async function addNewRole(name, access) {
    try {
        const role = await Roles.create({
            name,
            access
        });
        return role;
    } catch (err) {
        console.error('Error on Role service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description update  Role
 * @param {*} name
 * @returns
 */
async function updateRole(id,name, access) {
    try {
        const role = await Roles.updateOne({_id: id},{
            name,
            access
        });
        if (role && role.modifiedCount) {
            return { id };
        } else {
            throw role;
        }
    } catch (err) {
        console.error('Error on Role service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description  Bulk Add New Roles
 * @param {*} roles
 * @returns
 */
async function addNewRoles(roles) {
    try {
        const role = await Roles.insertMany(roles);
        return role;
    } catch (err) {
        console.error('Error on Role service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description Remove Role By Id
 * @param {*} id
 * @returns
 */
async function removeRole(id) {
    try {
        const role = await Roles.updateOne({ _id: id }, { active: false, deactivateDt: moment().utc() });

        if (role && role.modifiedCount) {
            return { id };
        } else {
            throw role;
        }
    } catch (err) {
        console.error('Error on Role service: ', err);
        throw err;
    }
}
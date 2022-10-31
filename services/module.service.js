const moment = require('moment');
const Module = require('../models/module');

module.exports.getAllModules = getAllModules;
module.exports.addNewModule = addNewModule;
module.exports.updateModule = updateModule;
module.exports.addNewModules = addNewModules;
module.exports.removeModule = removeModule;

/**
 * @async
 * @description get All Modules
 * @returns
 */
async function getAllModules() {
    try {
        const _modules = await Module.find({
            active: true
        });
        return _modules;
    } catch (err) {
        console.error('Error on Module service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description add New Module
 * @param {*} name
 * @returns
 */
async function addNewModule(name) {
    try {
        const _module = await Module.create({
            name
        });
        return _module;
    } catch (err) {
        console.error('Error on Module service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description  Bulk Add New Module
 * @param {*} modules
 * @returns
 */
async function addNewModules(modules) {
    try {
        const _modules = await Module.insertMany(modules);
        return _modules;
    } catch (err) {
        console.error('Error on Module service: ', err);
        throw err;
    }
}


/**
 * @async
 * @description update  Module
 * @param {*} name
 * @returns
 */
 async function updateModule(id, name) {
    try {
        const _module = await Module.updateOne({_id: id}, {name});
        if (_module && _module.modifiedCount) {
            return { id };
        } else {
            throw _module;
        }
    } catch (err) {
        console.error('Error on Module service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description Remove Module By Id
 * @param {*} id
 * @returns
 */
async function removeModule(id) {
    try {
        const _module = await Module.updateOne({ _id: id }, { active: false, deactivateDt: moment().utc() });

        if (_module && _module.modifiedCount) {
            return { id };
        } else {
            throw _module;
        }
    } catch (err) {
        console.error('Error on Module service: ', err);
        throw err;
    }
}
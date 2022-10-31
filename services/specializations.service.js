const moment = require('moment');
const Specialization = require('../models/specializations');

module.exports.getAllSpecializations = getAllSpecializations;
module.exports.addNewSpecialization = addNewSpecialization;
module.exports.updateSpecialization = updateSpecialization;
module.exports.addNewSpecializations = addNewSpecializations;
module.exports.removeSpecialization = removeSpecialization;

/**
 * @async
 * @description get All Specializations
 * @returns
 */
async function getAllSpecializations() {
    try {
        const specializations = await Specialization.find({
            active: true
        });
        return specializations;
    } catch (err) {
        console.error('Error on Specialization service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description add New Specialization
 * @param {*} name
 * @returns
 */
async function addNewSpecialization(name, imageUrl, description) {
    try {
        const specialization = await Specialization.create({
            name,
            image: imageUrl,
            description
        });
        return specialization;
    } catch (err) {
        console.error('Error on Specialization service: ', err);
        throw err;
    }
}
/**
 * @async
 * @description update Specialization
 * @param {*} name
 * @returns
 */
async function updateSpecialization(id,name, imageUrl, description) {
    try {
        const specialization = await Specialization.updateOne(
        {
            _id: id
        },
        {
            name,
            image: imageUrl,
            description
        });
        if (specialization && specialization.modifiedCount) {
            return { id };
        } else {
            throw specialization;
        }
    } catch (err) {
        console.error('Error on Specialization service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description  Bulk Add New Specialization
 * @param {*} Specializations
 * @returns
 */
async function addNewSpecializations(specializations) {
    try {
        const specialization = await Specialization.insertMany(specializations);
        return specialization;
    } catch (err) {
        console.error('Error on Specialization service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description Remove Specialization By Id
 * @param {*} id
 * @returns
 */
async function removeSpecialization(id) {
    try {
        const specialization = await Specialization.updateOne({ _id: id }, { active: false, deactivateDt: moment().utc() });

        if (specialization && specialization.modifiedCount) {
            return { id };
        } else {
            throw specialization;
        }
    } catch (err) {
        console.error('Error on Specialization service: ', err);
        throw err;
    }
}
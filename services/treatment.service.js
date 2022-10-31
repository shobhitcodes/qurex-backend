const moment = require('moment');
const Treatment = require('../models/treatments');

module.exports.getAllTreatments = getAllTreatments;
module.exports.addNewTreatment = addNewTreatment;
module.exports.updateTreatment = updateTreatment;
module.exports.addNewTreatments = addNewTreatments;
module.exports.removeTreatment = removeTreatment;

/**
 * @async
 * @description get All Treatments
 * @returns
 */
async function getAllTreatments() {
    try {
        const treatments = await Treatment.find({
            active: true
        }).populate('category');
        return treatments;
    } catch (err) {
        console.error('Error on Treatment service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description add New Treatment
 * @param {*} name
 * @returns
 */
async function addNewTreatment(name, imageUrl, description, gender, category) {
    try {
        const treatment = await Treatment.create({
            name,
            description,
            image: imageUrl,
            gender, 
            category
        });
        return treatment;
    } catch (err) {
        console.error('Error on Treatment service: ', err);
        throw err;
    }
}
/**
 * @async
 * @description update Treatment
 * @param {*} name
 * @returns
 */
async function updateTreatment(id, name, imageUrl, description, gender, category) {
    try {
        const treatment = await Treatment.updateOne({_id: id},{
            name,
            description,
            image: imageUrl,
            gender, 
            category
        });
        if (treatment && treatment.modifiedCount) {
            return { id };
        } else {
            throw treatment;
        }
    } catch (err) {
        console.error('Error on Treatment service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description  Bulk Add New Treatment
 * @param {*} treatments
 * @returns
 */
async function addNewTreatments(treatments) {
    try {
        const treatment = await Treatment.insertMany(treatments);
        return treatment;
    } catch (err) {
        console.error('Error on Treatment service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description Remove Treatment By Id
 * @param {*} id
 * @returns
 */
async function removeTreatment(id) {
    try {
        const treatment = await Treatment.updateOne({ _id: id }, { active: false, deactivateDt: moment().utc() });

        if (treatment && treatment.modifiedCount) {
            return { id };
        } else {
            throw treatment;
        }
    } catch (err) {
        console.error('Error on Treatment service: ', err);
        throw err;
    }
}
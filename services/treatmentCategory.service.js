const moment = require('moment');
const TreatmentCategory = require('../models/treatmentCategory');

module.exports.getAllTreatmentCategories = getAllTreatmentCategories;
module.exports.addNewTreatmentCategory = addNewTreatmentCategory;
module.exports.updateTreatmentCategory = updateTreatmentCategory;
module.exports.removeTreatmentCategory = removeTreatmentCategory;

/**
 * @async
 * @description get All TreatmentCategory
 * @returns
 */
async function getAllTreatmentCategories() {
    try {
        const treatments = await TreatmentCategory.find({
            active: true
        });
        return treatments;
    } catch (err) {
        console.error('Error on Treatment Category service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description add New TreatmentCategory
 * @param {*} name
 * @returns
 */
async function addNewTreatmentCategory(name, imageUrl, description) {
    try {
        const treatment = await TreatmentCategory.create({
            name,
            image: imageUrl,
            description
        });
        return treatment;
    } catch (err) {
        console.error('Error on Treatment Category service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description update TreatmentCategory
 * @param {*} name
 * @returns
 */
 async function updateTreatmentCategory(id, name, imageUrl, description) {
    try {
        const treatmentCategory = await TreatmentCategory.updateOne({_id: id},{
            name,
            image: imageUrl,
            description
        });
        if (treatmentCategory && treatmentCategory.modifiedCount) {
            return { id };
        } else {
            throw treatmentCategory;
        }
    } catch (err) {
        console.error('Error on Treatment Category service: ', err);
        throw err;
    }
}



/**
 * @async
 * @description Remove TreatmentCategory By Id
 * @param {*} id
 * @returns
 */
async function removeTreatmentCategory(id) {
    try {
        const treatment = await TreatmentCategory.updateOne({ _id: id }, { active: false, deactivateDt: moment().utc() });

        if (treatment && treatment.modifiedCount) {
            return { id };
        } else {
            throw treatment;
        }
    } catch (err) {
        console.error('Error on Treatment Category service: ', err);
        throw err;
    }
}
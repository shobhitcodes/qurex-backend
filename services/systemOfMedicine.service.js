const moment = require('moment');
const SystemOfMedicine = require('../models/systemOfMedicines');

module.exports.getAllSystemOfMedicines = getAllSystemOfMedicines;
module.exports.addNewSystemOfMedicine = addNewSystemOfMedicine;
module.exports.updateSystemOfMedicine = updateSystemOfMedicine;
module.exports.removeSystemOfMedicine = removeSystemOfMedicine;

/**
 * @async
 * @description get All SystemOfMedicines
 * @returns
 */
async function getAllSystemOfMedicines() {
    try {
        const cities = await SystemOfMedicine.find({
            active: true
        });
        return cities;
    } catch (err) {
        console.error('Error on SystemOfMedicine service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description add New SystemOfMedicine
 * @param {*} name
 * @returns
 */
async function addNewSystemOfMedicine(name) {
    try {
        const city = await SystemOfMedicine.create({
            name
        });
        return city;
    } catch (err) {
        console.error('Error on SystemOfMedicine service: ', err);
        throw err;
    }
}


/**
 * @async
 * @description update  SystemOfMedicine
 * @param {*} name
 * @returns
 */
 async function updateSystemOfMedicine(id, name) {
    try {
        const systemOfMedicine = await SystemOfMedicine.updateOne({_id: id}, {name});
        if (systemOfMedicine && systemOfMedicine.modifiedCount) {
            return { id };
        } else {
            throw systemOfMedicine;
        }
    } catch (err) {
        console.error('Error on SystemOfMedicine service: ', err);
        throw err;
    }
}


/**
 * @async
 * @description Remove SystemOfMedicine By Id
 * @param {*} id
 * @returns
 */
async function removeSystemOfMedicine(id) {
    try {
        const city = await SystemOfMedicine.updateOne({ _id: id }, { active: false, deactivateDt: moment().utc() });

        if (city && city.modifiedCount) {
            return { id };
        } else {
            throw city;
        }
    } catch (err) {
        console.error('Error on SystemOfMedicine service: ', err);
        throw err;
    }
}
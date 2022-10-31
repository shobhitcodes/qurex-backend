const moment = require('moment');
const Cities = require('../models/cities');

module.exports.getAllCities = getAllCities;
module.exports.addNewCity = addNewCity;
module.exports.updateCity = updateCity;
module.exports.addNewCities = addNewCities;
module.exports.removeCity = removeCity;

/**
 * @async
 * @description get All Cities
 * @returns
 */
async function getAllCities() {
    try {
        const cities = await Cities.find({
            active: true
        });
        return cities;
    } catch (err) {
        console.error('Error on City service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description add New City
 * @param {*} name
 * @returns
 */
async function addNewCity(name) {
    try {
        const city = await Cities.create({
            name
        });
        return city;
    } catch (err) {
        console.error('Error on City service: ', err);
        throw err;
    }
}


/**
 * @async
 * @description update New City
 * @param {*} name
 * @returns
 */
 async function updateCity(id, name) {
    try {
        const city = await Cities.updateOne({_id: id}, {name});
        if (city && city.modifiedCount) {
            return { id };
        } else {
            throw city;
        }
    } catch (err) {
        console.error('Error on City service: ', err);
        throw err;
    }
}

/**
 * @async
 * @description  Bulk Add New Cities
 * @param {*} cities
 * @returns
 */
async function addNewCities(cities) {
    try {
        const city = await Cities.insertMany(cities);
        return city;
    } catch (err) {
        console.error('Error on City service: ', err);
        throw err;
    }
}



/**
 * @async
 * @description Remove City By Id
 * @param {*} id
 * @returns
 */
async function removeCity(id) {
    try {
        const city = await Cities.updateOne({ _id: id }, { active: false, deactivateDt: moment().utc() });

        if (city && city.modifiedCount) {
            return { id };
        } else {
            throw city;
        }
    } catch (err) {
        console.error('Error on City service: ', err);
        throw err;
    }
}
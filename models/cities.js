'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema(
    {
        name: { type: String },
        active: { type: Boolean, default: true },
        deactivateDt: Date
    },
    { timestamps: true, collection: 'cities' }
);

module.exports = mongoose.model('Cities', CitySchema);
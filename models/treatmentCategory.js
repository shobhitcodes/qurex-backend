'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const treatmentCategorySchema = new Schema(
    {
        name: { type: String },
        active: { type: Boolean, default: true },
        deactivateDt: Date,
        image: { type: String },
        description: {type: String},
    },
    { timestamps: true, collection: 'treatmentCategory' }
);

module.exports = mongoose.model('TreatmentCategory', treatmentCategorySchema);
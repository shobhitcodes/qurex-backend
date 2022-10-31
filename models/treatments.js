'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TreatmentCategory = require('./treatmentCategory');

const treatmentSchema = new Schema(
    {
        name: { type: String },
        active: { type: Boolean, default: true },
        deactivateDt: Date,
        image: { type: String },
        description: {type: String},
        gender: { type: String, enum: ['M', 'F', 'B'] },
        category: {type: mongoose.Types.ObjectId, ref: TreatmentCategory}

    },
    { timestamps: true, collection: 'treatment' }
);

module.exports = mongoose.model('Treatment', treatmentSchema);
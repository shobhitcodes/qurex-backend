'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specializationSchema = new Schema(
    {
        name: { type: String },
        active: { type: Boolean, default: true },
        deactivateDt: Date,
        image: { type: String },
        description: {type: String}
    },
    { timestamps: true, collection: 'specialization' }
);

module.exports = mongoose.model('Specialization', specializationSchema);
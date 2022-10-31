'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SystemOfMedicineSchema = new Schema(
    {
        name: { type: String },
        active: { type: Boolean, default: true },
        deactivateDt: Date
    },
    { timestamps: true, collection: 'systemOfMedicine' }
);

module.exports = mongoose.model('SystemOfMedicine', SystemOfMedicineSchema);
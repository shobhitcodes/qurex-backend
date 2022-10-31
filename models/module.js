'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema(
    {
        name: { type: String },
        active: {type: Boolean, default: true},
        deactivateDt: Date
    },
    { timestamps: true, collection: 'module' }
);

module.exports = mongoose.model('Module', ModuleSchema);
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Module = require('./module');


const RoleSchema = new Schema(
    {
        name: { type: String },
        active: { type: Boolean, default: true },
        deactivateDt: Date,
        access: [
            {
                module: { type: mongoose.Types.ObjectId, ref: Module, require: true },
                read: {type: Boolean, default: true},
                write: {type: Boolean, default: false},
                create: {type: Boolean, default: false},
                delete: {type: Boolean, default: false},
            }
        ]
        
    },
    { timestamps: true, collection: 'role' }
);

module.exports = mongoose.model('Role', RoleSchema);
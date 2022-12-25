'use strict';

const mongoose = require('mongoose');
const drQuro = require('./drQuro');
const User = require('./user');
const Schema = mongoose.Schema;

const drQuroUserConversationSchema = new Schema(
    {
        userId: {type: mongoose.Types.ObjectId, ref: User},
        gender: String,
        issue: String,
        userName: String,
        userEmail: String,
        srCheckValue: {type:Number, default: 0},
        isDRValue: {type: Boolean, default: false},
        major_symptom: [String],
        other_symptoms: [String],
        details: [String],
        additional_information: [String],
        diagnosis: [String],
        recommended_doctor: [String],
        recommended_lab_test: [String],
        general_advice: [String],
        causes: [String],
        blog_url: [String],
        media_url: [String],
        conversations: [{type: mongoose.Types.ObjectId, ref: drQuro}],
        isCompleted: {type: Boolean, defaule: false},
        active: {type: Boolean, default: true},
        isORSelected: {type: Boolean, default: false},
        isAndSelected: {type: Boolean, default: false}
    },
    { timestamps: true, collection: 'drQuroUserConversation' }
)
module.exports = mongoose.model('drQuroUserConversation', drQuroUserConversationSchema);

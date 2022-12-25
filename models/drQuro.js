'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const drQuroSchema = new Schema(
    {
        gender: { type: String, enum: ['MALE', 'FEMALE'] },
        name: String,
        node_id: String,     
        node_type: String,                            
        message: String,
        node_type: String,
        major_symptom: String,
        other_symptoms: String,
        additional_information: String,
        diagnosis: String,
        details: String,
        recommended_doctor: String, 
        recommended_lab_test: String,
        general_advice: String,
        causes: String,
        blog_url: String,
        media_url: String,
        childrenArr: [{type: mongoose.Types.ObjectId}]
        
    },
    { timestamps: true, collection: 'drQuroNew' }
);

module.exports = mongoose.model('drQuro', drQuroSchema);

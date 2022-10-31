'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueTicketSchema = new Schema(
    {
        ticketId: String, // custom id
        userId: String,
        title: String,
        description: String, // msg
        status: String,
        screenshots: [String],
    },
    { timestamps: true, collection: 'issue_ticket' }
);

module.exports = mongoose.model('IssueTicket', issueTicketSchema);

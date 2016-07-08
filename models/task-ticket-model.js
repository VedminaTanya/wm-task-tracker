/**
 * User model.
 *
 * User mongoose schema,
 * bcrypt middleware on UserSchema,
 * User password verification function.
 */
"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nconf = require('nconf');
const log = require('../utils/logger')(module);

/** read configuration*/
nconf.reset();
nconf.argv().env()
    .add('secret', {type: 'file', file: 'config/tasks-config.json'});

const TASK_STATUSES = nconf.get("task-ticket-status-enums:statuses");

log.debug("Available tasks statuses: %s", JSON.stringify(TASK_STATUSES));

/**
 * Task ticket schema.
 *
 * Encapsulates fields validators.
 */
var TaskTicketSchema = new mongoose.Schema({
    assigned_to_user_login: {
        type: String
        //TODO login regexp validation here
    },
    name: {
        type: String,
        required: [true, "No ticket name!"]
    },
    task_text: {
        type: String
    },
    expiration_date: {
        type: Date
    },
    additional_files: {
        type: [Buffer]
    },
    task_status: {
        type: String,
        enum: TASK_STATUSES,
        required: [true, "No role"]
    }
});

/**
 * Actions performing before VALIDATION of task ticket fields.
 *
 * Set ticket tsk status as free.
 */
TaskTicketSchema.pre('validate', function (next) {
    let taskTicket = this;
    taskTicket.task_status = TASK_STATUSES[TASK_STATUSES.indexOf("free")];

    next();
});

module.exports = mongoose.model('TaskTicket', TaskTicketSchema);
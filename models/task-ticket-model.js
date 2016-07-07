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

log.info("Available tasks statuses: %s", JSON.stringify(TASK_STATUSES));

/**
 * Task ticket schema.
 *
 * Encapsulates fields validators.
 */
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "No ticket name!"]
    },
    detailed_task: {
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
    },
    password: {
        type: String,
        required: [true, "No password!"]
    },
    /** while user register - set role automatically*/
    role: {
        type: String,
        enum: USER_ROLES,
        required: [true, "No role"]
    }
});

module.exports = mongoose.model('User', UserSchema);
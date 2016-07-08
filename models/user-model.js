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
    .add('secret', {type: 'file', file: 'config/config-common.json'})
    .add('user-fields-enums', {type: 'file', file: 'config/user-auth-groups.json'});

const SALT_WORK_FACTOR = 10;
const USER_ROLES = nconf.get("user-fields-enums:roles");
log.info("user roles %s", USER_ROLES);

/**
 * User schema.
 *
 * Encapsulates fields validators.
 */
var UserSchema = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: [true, "No login!"]
        //TODO login regexp validation here
    },
    email: {
        type: String,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email!"],
        required: [true, "No email!"]
    },
    name: {
        type: String,
        required: [true, "No full name!"]
    },
    contact_number: {
        type: String,
        required: [true, "No contact number!"]
    },
    education: {
        type: String
    },
    key_skills: {
        type: String
    },
    additional_info: {
        type: String
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

/**
 * Actions performing before VALIDATION of user fields.
 *
 * Set user role as default.
 */
UserSchema.pre('validate', function (next) {
    const USER_ROLE_INDEX = 0;

    let user = this;
    /** set user role as default - USER */
    user.role = USER_ROLES[USER_ROLE_INDEX];

    next();
});

/**
 * bcrypt middleware for User and logging.
 *
 * Performing before saving User to DB,
 * automatically hash the password before it’s saved to the database.
 */
UserSchema.pre('save', function (next) {
    let user = this;
    log.info('User trying to register %s', JSON.stringify(user));

    // only hash the password if it has been modified (or is new)
    if (this.isModified('password') || this.isNew) {
        //generate salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) return next(err);

            // hash the password along with our new salt
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);

                // override the plain text password with the hashed one
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

/**
 * Password comparing.
 *
 * @method comparePassword
 * @param candidatePassword
 * @param cb
 */
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);

        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
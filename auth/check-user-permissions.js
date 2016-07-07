"use strict";
const HttpStatus = require('http-status-codes');
const Permissions = require('./Permissions');
const log = require('../utils/logger')(module);
const nconf = require('nconf');

/** read configuration*/
nconf.reset();
nconf.argv().env()
    .add('user-groups', {type: 'file', file: 'config/user-auth-groups.json'});

const VALUE_EXISTS = 0;
const ADMINS_GROUP = nconf.get('user-groups:adminsGroup');

/**
 * Check user permissions.
 *
 * @param user - user obj from DB. {@link /models/user-models.js}
 * @param permissions - permissions obj {@link ./permissions.js}
 * @param req
 * @param res
 * @param next
 */
function checkPermissions(permissions, user, req, res, next) {
    /** check that access provided for concrete user*/
    if (user.login == permissions.userLogin) {
        next();
    } else
    /** check that user role exists in permission*/
    if (permissions.roles.indexOf(user.role) == VALUE_EXISTS) {
        next();
    } else {
        res.statusCode = HttpStatus.FORBIDDEN;
        res.end();
    }
}

/**
 * Check permissions, access only for admins.
 *
 * @method onlyAdmin
 * @param req - request from user for accessing protected resource.
 * @param res
 * @param next - next middleware function.
 */
module.exports.onlyAdmin = function (req, res, next) {
    //get user from special request field.
    let user = res.locals;
    let adminPermissions = new Permissions(null, ADMINS_GROUP.roles);
    log.info("Admin permissions checking, permissions: %j\r\n user: %j", adminPermissions, user);
    checkPermissions(adminPermissions, user, req, res, next);
};

/**
 * Check permissions, access only for concrete user and admins
 *
 * @method singleUserAndAdmin
 * @param req - request from user for accessing protected resource.
 * @param res
 * @param next - next middleware function.
 */
module.exports.singleUserAndAdmin = function (req, res, next) {
    //get user from special request field.
    let user = res.locals;
    let userPermissions = new Permissions(user.login, ADMINS_GROUP.roles);
    log.info("Single user and Admin permissions checking, permissions: %j\r\n user: %j", userPermissions, user);
    checkPermissions(userPermissions, user, req, res, next);
};
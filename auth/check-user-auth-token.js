"use strict";
const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const HttpStatus = require('http-status-codes');
const nconf = require('nconf');
const log = require('../utils/logger')(module);

/** read configuration*/
nconf.reset();
nconf.argv()
    .env()
    .file({file: 'config/common-config.json'});

const SECRET_KEY = nconf.get("security:secret");

/**
 * Fetch user from DB by encoded token.
 *
 * By login from jwt token from 'Authorization' header.
 * Middleware, passes on user obj, to next function.
 *
 * @param req - client request with authorization header
 * @param res
 * @param next - pass user obj from DB to next cb
 */
module.exports = function (req, res, next) {
    let authToken = req.headers.authorization;
    log.info("Auth token from client: %s", authToken);

    if (authToken) {
        //decode jwt token
        let jwtDecodeErrorFlag = false;
        try {
            var decodedJWT = jwt.decode(authToken, SECRET_KEY);
        } catch (err) {
            jwtDecodeErrorFlag = true
        }

        //validate that login && password presents
        if (!jwtDecodeErrorFlag && decodedJWT.login && decodedJWT.password) {
            log.info("user fields are valid, trying to find user with login %s in DB", decodedJWT.login);

            /** retrieve user from DB*/
            mongoose.model('User').findOne({login: decodedJWT.login}, function (err, user) {

                /** validate that user exists and pass equals to pass from DB*/
                if (user && !err && user.password == decodedJWT.password) {
                    /**put user to special "local" field to pass him to next function*/
                    res.locals = user;
                    next();
                } else {
                    res.statusCode = HttpStatus.UNAUTHORIZED;
                    res.end();
                }
            });
        } else {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.end();
        }
    } else {
        res.statusCode = HttpStatus.FORBIDDEN;
        res.end();
    }
};
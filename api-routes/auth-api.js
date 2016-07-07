"use strict";
const express = require('express');
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
 * Route to authenticate a user
 *
 * @method signIn
 *
 * @param req
 * @param res
 */
module.exports.signIn = function (req, res) {
    if (req.body.login && req.body.password) {
        /** find user by login in DB*/
        mongoose.model('User').findOne({login: req.body.login})
            .then((user)=> {
            if (user) {
                log.info("User trying to log in: %s", JSON.stringify(user));

                /** Check that client password matches user from DB password.*/
                user.comparePassword(req.body.password, function (err, isMatch) {
                    (isMatch && !err) ?
                        /** response to client with token*/
                        res.json({token: jwt.encode(user, SECRET_KEY)})
                        : res.status(HttpStatus.UNAUTHORIZED).end();
                });
            } else
                res.status(HttpStatus.BAD_REQUEST).end();
    }
    )
    .catch((err)=> {
            log.log('error', err);
        res.status(HttpStatus.UNAUTHORIZED).end();
    });
    } else {
        log.info("User trying to log in without login or password");
        res.status(HttpStatus.BAD_REQUEST).end();
    }
};
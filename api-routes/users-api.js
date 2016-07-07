/**
 * Users REST API implementation.
 */
"use strict";
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jwt-simple');
// const util = require('util');
const HttpStatus = require('http-status-codes');
const nconf = require('nconf');

const log = require('../utils/logger')(module);
const UserModel = require('../models/user-model');

/** read configuration*/
nconf.reset();
nconf.argv()
    .env()
    .file({file: 'config/common-config.json'});

const SECRET_KEY = nconf.get("security:secret");

/**
 * Response all users from DB to client.
 *
 * @method getAllUsers.
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.getAllUsers = function (req, res, next) {
    log.info("Retrieving all users from DB");
    mongoose.model('User').find({}, function (err, users) {
        if (err || !users) {
            res.statusCode = HttpStatus.NO_CONTENT;
            res.end();
        }
        else {
            res.json(users);
        }
    })
};

/**
 * Response single user by login from DB to client.
 *
 * @method getSingleUser
 * @apiParam {String} :user_login user's login to find by
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.getSingleUser = function (req, res, next) {
    mongoose.model('User').findOne({login: req.params.user_login},
        function (err, user) {
            if (err) {
                log.error("While requesting for user with login %s, err: %s", req.params.login, err);
                res.statusCode = HttpStatus.NOT_FOUND;
                res.end();
            }
            else {
                if (user)
                    res.json(user);
                else {
                    res.statusCode = HttpStatus.NO_CONTENT;
                    res.end();
                }
            }
        })
};

/**
 * Create new user in DB from client request.
 *
 * @method createNewUser
 * @param req - request contains new user
 * @param res
 */
module.exports.createNewUser = function (req, res) {
    let newUser = new UserModel(req.body);

    /** trying to save new user*/
    newUser.save(function (err, user) {
        if (err || !user) {
            log.log('error', "Error while saving user to DB %s, %s", JSON.stringify(user), String(err));
            //validation problem
            if (err.name === "ValidationError") {
                res.status(HttpStatus.BAD_REQUEST).send(err.errors);
            } else {
                //user already exists in DB
                res.status(HttpStatus.CONFLICT).end();
            }
        } else {
            /** response with auth token - log in*/
            let token = jwt.encode(user, SECRET_KEY);
            res.status(HttpStatus.CREATED).json({token: token});
        }
    });
};

/**
 * Replace user by new one from client request.
 *
 * @method replaceUserByNew
 * @apiParam {string} user_login - user's login to find by
 * @param req
 * @param res
 */
module.exports.replaceUserByNew = function (req, res) {
    let userLogin = req.params.user_login;
    let newUser = req.body;
    log.info("Updating user %s by %s", userLogin, JSON.stringify(req.body));

    //FIXME hashing user password while updating
    if (newUser) {
        mongoose.model('User').findOneAndUpdate({login: userLogin}, newUser, {new: true},
            function (err, user) {
                if (err) {
                    log.log('error', "While requesting for user with login %s error occurs: %s", req.params.login, String(err));
                    res.status(HttpStatus.NOT_FOUND).end();
                }
                else {
                    if (user)
                        res.json(user);
                    else
                        res.status(HttpStatus.NO_CONTENT).end();
                }
            })
    } else res.status(HttpStatus.BAD_REQUEST).end();
};

/**
 * Delete user by login.
 *
 * @method deleteSingleUser
 * @apiParam {String} user_login - user's login to delete
 * @param req
 * @param res
 */
module.exports.deleteSingleUser = function (req, res, next) {
    mongoose.model('User').remove({login: req.params.user_login},
        function (err, user) {
            if (err) {
                log.log('error', "While deleting user with login %s error occurs: %s", req.params.login, err);
                res.statusCode = HttpStatus.CONFLICT;
                res.end();
            }
            else {
                if (user)
                    res.json(user);
                else {
                    res.statusCode = HttpStatus.NOT_FOUND;
                    res.end();
                }
            }
        })
};
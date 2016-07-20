/**
 * Task Ticket REST API implementation.
 */
"use strict";
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const HttpStatus = require('http-status-codes');
const nconf = require('nconf');

const log = require('../utils/logger')(module);
const TaskTicketModel = require('../models/task-ticket-model');

/**
 * Create new Task Ticket.
 *
 * @method createNewTask
 * @param req
 * @param res
 * @param next
 */
module.exports.createNewTask = function (req, res, next) {
    let newTask = new TaskTicketModel(req.body);

    newTask.save()
        .then((task)=>res.status(HttpStatus.CREATED).json(task))
        .catch((err)=> {
            log.error("Error while saving task to DB %s, %s", JSON.stringify(req.body), String(err));

            //if validation problem
            if (err.name === "ValidationError") {
                res.status(HttpStatus.BAD_REQUEST).send(err.errors);
            } else {
                //task already exists in DB
                res.status(HttpStatus.CONFLICT).end();
            }
        });
};

/**
 * Get Task Ticket by _id.
 *
 * @method getSingleTask
 * @param req
 * @param res
 * @param next
 */
module.exports.getSingleTask = function (req, res, next) {
    mongoose.model('TaskTicket').findOne({_id: req.params.task_id})
        .then((task)=> {
            res.status(HttpStatus.OK).json(task);
        })
        .catch((err)=> {
            log.log('error', err);
            res.status(HttpStatus.CONFLICT).end();
        });
};

/**
 * Replace Task Ticket by new one.
 *
 * @method replaceTaskByNew
 * @param req
 * @param res
 * @param next
 */
module.exports.replaceTaskByNew = function (req, res, next) {
    let newTask = new TaskTicketModel(req.body);

    mongoose.model('TaskTicket').findOneAndUpdate({_id: req.params.task_id}, newTask, {new: true})
        .then((task)=> {
            res.status(HttpStatus.OK).json(task);
        })
        .catch((err)=> {
            log.log('error', err);
            res.status(HttpStatus.CONFLICT).end();
        });
};

/**
 * Delete Task Ticket by _id.
 *
 * @method deleteSingleTask
 * @param req
 * @param res
 * @param next
 */
module.exports.deleteSingleTask = function (req, res, next) {
    mongoose.model('TaskTicket').remove({_id: req.params.task_id})
        .then((task)=> {
            res.status(HttpStatus.OK).end();
        })
        .catch((err)=> {
            log.log('error', err);
            res.status(HttpStatus.CONFLICT).end();
        });
};

/**
 * Edit Task Ticket by _id.
 *
 * @method editTask
 * @param req
 * @param res
 * @param next
 */
module.exports.editTask = function (req, res, next) {
    const REPLACE_OPERATION_NAME = "replace";

    if (req.body.op == REPLACE_OPERATION_NAME) {
        //get field from req path, for example path=/task_text, actual field name = task_text.
        let fieldUpdateObj = {};
        fieldUpdateObj[req.body.path.substring(1)] = req.body.value;

        mongoose.model('TaskTicket').findOneAndUpdate({_id: req.params.task_id}, {$set: fieldUpdateObj}, {new: true})
            .then((task)=> {
                res.status(HttpStatus.OK).json(task);
            })
            .catch((err)=> {
                log.log('error', err);
                res.status(HttpStatus.CONFLICT).end();
            });
    } else res.status(HttpStatus.BAD_REQUEST).end();
};

/**
 * Get all Task Tickets assigned to user with appropriate status or without.
 *
 * @method getSingleUserTasks
 * @param req
 * @param res
 * @param next
 */
module.exports.getSingleUserTasks = function (req, res, next) {
    mongoose.model('TaskTicket').find({assigned_to_user_login: req.params.user_login})
        .then((tasks)=> {
            res.status(HttpStatus.OK).json(tasks);
        })
        .catch((err)=> {
            log.log('error', err);
            res.status(HttpStatus.CONFLICT).end();
        });
};

/**
 * Get all Task Tickets with appropriate status or without.
 *
 * @method getAllTasks
 * @param req
 * @param res
 * @param next
 */
module.exports.getAllTasks = function (req, res, next) {
    mongoose.model('TaskTicket').find({})
        .then((tasks)=> {
            res.status(HttpStatus.OK).json(tasks);
        })
        .catch((err)=> {
            log.log('error', err);
            res.status(HttpStatus.CONFLICT).end();
        });
};

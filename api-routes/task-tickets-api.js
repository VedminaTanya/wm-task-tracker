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
    // log.debug("Trying to find single task by id %s", req.params.task_id);

    mongoose.model('TaskTicket').findOne({_id: req.params.task_id})
        .then((task)=> {
            res.status(HttpStatus.OK).json(task);
        });
    //TODO implement .catch
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
    return new Error("Not implemented");
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
        });
    //TODO implement .catch
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
    return new Error("Not implemented");
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
    return new Error("Not implemented");
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
        });
    //TODO implement .catch
};


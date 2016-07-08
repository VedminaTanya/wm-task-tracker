"use strict";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/** connect to DB*/
const databaseConfig = require('./utils/database-connect');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** Auth API routing */
/**
 * @api {post} /sign-in/ Log in to system, response with access token: JWT.
 * @apiGroup Auth
 *
 * @apiParam {string} login user's login
 * @apiParam {string} password users's password
 *
 * @apiSuccess (200) {string} token jwt auth token
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwibmFtZSI6InRlc3QgdXNlciB1c2Vyb3ZpY2giLCJjb250YWN0X251bWJlciI6IjA5OSA5OTkgOTk5OSIsInBhc3N3b3JkIjoiJDJhJDEwJGtUR2pGZXF3ODh5ZTdWbVJXdno0RmV6bW9raXdkWFZOYUNGcmp5blpxMHJ6NHhqbXluSXMyIiwiX2lkIjoiNTc3Zjk1YTQ1ODg4YmE2ODQ3MmJmYWRiIn0._wRkAlJdX-wAfxtD-a9douRkYSm1aZ3d_6xT_ycZoxY"}
 *
 * @apiError (400) NoSuchUser
 * @apiError (400) NoLoginOrPassword
 * @apiError (401) WrongPassword
 */
app.post('/sign-in', require('./api-routes/auth-api').signIn);

/**
 * @api {post} /sign-up/ Register in system.
 * @apiGroup Auth
 *
 * @apiParam {Object} user
 *
 * @apiSuccess (201) {string} token jwt auth token
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 CREATED
 *     {"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwibmFtZSI6InRlc3QgdXNlciB1c2Vyb3ZpY2giLCJjb250YWN0X251bWJlciI6IjA5OSA5OTkgOTk5OSIsInBhc3N3b3JkIjoiJDJhJDEwJGtUR2pGZXF3ODh5ZTdWbVJXdno0RmV6bW9raXdkWFZOYUNGcmp5blpxMHJ6NHhqbXluSXMyIiwiX2lkIjoiNTc3Zjk1YTQ1ODg4YmE2ODQ3MmJmYWRiIn0._wRkAlJdX-wAfxtD-a9douRkYSm1aZ3d_6xT_ycZoxY"}
 *
 * @apiError (400) ValidationError invalid fields
 * @apiError (409) ConflictInDB user with one or more unique fields already exists
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {"email":{"message":"Invalid email!","name":"ValidatorError","properties":{"regexp":{},"type":"regexp","message":"Invalid email!","path":"email","value":"admin@a.ruuuuuuuuuuuuuuu"},"kind":"regexp","path":"email","value":"admin@a.ruuuuuuuuuuuuuuu"}}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {"password":{"message":"No password!","name":"ValidatorError","properties":{"type":"required","message":"No password!","path":"password"},"kind":"required","path":"password"},"contact_number":{"message":"No contact number!","name":"ValidatorError","properties":{"type":"required","message":"No contact number!","path":"contact_number"},"kind":"required","path":"contact_number"},"name":{"message":"No full name!","name":"ValidatorError","properties":{"type":"required","message":"No full name!","path":"name"},"kind":"required","path":"name"},"email":{"message":"No email!","name":"ValidatorError","properties":{"type":"required","message":"No email!","path":"email"},"kind":"required","path":"email"}}
 */
app.post('/sign-up', require('./api-routes/users-api').createNewUser);

/** User API  routing */

/**
 * @api {get} /api/users/:user_login Fetch single user by login.
 * @apiGroup User
 *
 * @apiParam {String} user_login user's login
 *
 * @apiHeader {String} token jwt auth token
 * @apiHeaderExample {String} Header-Example:
 *     {
 *       "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwibmFtZSI6InRlc3QgdXNlciB1c2Vyb3ZpY2giLCJjb250YWN0X251bWJlciI6IjA5OSA5OTkgOTk5OSIsInBhc3N3b3JkIjoiJDJhJDEwJGtUR2pGZXF3ODh5ZTdWbVJXdno0RmV6bW9raXdkWFZOYUNGcmp5blpxMHJ6NHhqbXluSXMyIiwiX2lkIjoiNTc3Zjk1YTQ1ODg4YmE2ODQ3MmJmYWRiIn0._wRkAlJdX-wAfxtD-a9douRkYSm1aZ3d_6xT_ycZoxY"
 *     }
 *
 * @apiPermission this user of admin
 *
 * @apiSuccess (200) {json} user
 *
 * @apiError (404) NotFound
 * @apiError (403) Forbidden invalid auth token
 */
app.get('/api/users/:user_login', require('./api-routes/users-api').getSingleUser);

/**
 * @api {put} /api/users/:user_login Replace user by new one.
 * @apiGroup User
 *
 * @apiParam {String} user_login user's login
 * @apiParam {Object} user new user
 *
 * @apiHeader {String} token jwt auth token
 * @apiHeaderExample {String} Header-Example:
 *     {
 *       "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwibmFtZSI6InRlc3QgdXNlciB1c2Vyb3ZpY2giLCJjb250YWN0X251bWJlciI6IjA5OSA5OTkgOTk5OSIsInBhc3N3b3JkIjoiJDJhJDEwJGtUR2pGZXF3ODh5ZTdWbVJXdno0RmV6bW9raXdkWFZOYUNGcmp5blpxMHJ6NHhqbXluSXMyIiwiX2lkIjoiNTc3Zjk1YTQ1ODg4YmE2ODQ3MmJmYWRiIn0._wRkAlJdX-wAfxtD-a9douRkYSm1aZ3d_6xT_ycZoxY"
 *       "content-type": "application/json"
 *     }
 *
 * @apiPermission this user of admin
 *
 * @apiSuccess (200) {json} new user
 *
 * @apiError (400) BadRequest
 * @apiError (404) NotFound
 * @apiError (403) Forbidden invalid auth token
 */
app.put('/api/users/:user_login', require('./api-routes/users-api').replaceUserByNew);

/**
 * @api {delete} /api/users/:user_login Delete user.
 * @apiGroup User
 *
 * @apiParam {String} user_login user's login
 *
 * @apiHeader {String} token jwt auth token
 * @apiHeaderExample {String} Header-Example:
 *     {
 *       "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwibmFtZSI6InRlc3QgdXNlciB1c2Vyb3ZpY2giLCJjb250YWN0X251bWJlciI6IjA5OSA5OTkgOTk5OSIsInBhc3N3b3JkIjoiJDJhJDEwJGtUR2pGZXF3ODh5ZTdWbVJXdno0RmV6bW9raXdkWFZOYUNGcmp5blpxMHJ6NHhqbXluSXMyIiwiX2lkIjoiNTc3Zjk1YTQ1ODg4YmE2ODQ3MmJmYWRiIn0._wRkAlJdX-wAfxtD-a9douRkYSm1aZ3d_6xT_ycZoxY"
 *     }
 *
 * @apiPermission this user of admin
 *
 * @apiError (403) Forbidden invalid auth token
 * @apiError (404) NotFound
 */
app.delete('/api/users/:user_login', require('./api-routes/users-api').deleteSingleUser);

/**
 * @api {get} /api/users/ Get all users from DB.
 * @apiGroup Admin
 *
 * @apiHeader {String} token jwt auth token
 * @apiHeaderExample {String} Header-Example:
 *     {
 *       "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwibmFtZSI6InRlc3QgdXNlciB1c2Vyb3ZpY2giLCJjb250YWN0X251bWJlciI6IjA5OSA5OTkgOTk5OSIsInBhc3N3b3JkIjoiJDJhJDEwJGtUR2pGZXF3ODh5ZTdWbVJXdno0RmV6bW9raXdkWFZOYUNGcmp5blpxMHJ6NHhqbXluSXMyIiwiX2lkIjoiNTc3Zjk1YTQ1ODg4YmE2ODQ3MmJmYWRiIn0._wRkAlJdX-wAfxtD-a9douRkYSm1aZ3d_6xT_ycZoxY"
 *     }
 *
 * @apiPermission admin
 *
 * @apiSuccess (200) {Array} users array of users
 * @apiSuccess (204) NoContent
 *
 * @apiError (403) Forbidden invalid auth token
 */
app.get('/api/users', require('./api-routes/users-api').getAllUsers);

/**
 * Task tickets API
 */

/**
 * @api {post} /api/tasks/ create new task.
 * @apiGroup TaskTickets
 *
 * @apiParam {Object} taskTicket
 *
 * @apiPermission admin
 *
 * @apiSuccess (201) {Object} taskTicket
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 CREATED
 *     {}
 *
 * @apiError (400) ValidationError invalid fields
 * @apiError (409) ConflictInDB task ticket with one or more unique fields already exists
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 BadRequest
 *     {}
 */
app.post('/api/tasks', require('./api-routes/task-tickets-api').createNewTask);

/**
 * @api {get} /api/tasks/:task_id Fetch single task ticket by _id.
 * @apiGroup TaskTickets
 *
 * @apiParam {String} task_id task's _id
 *
 * @apiHeader {String} token jwt auth token
 * @apiHeaderExample {String} Header-Example:
 *     {
 *       "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwibmFtZSI6InRlc3QgdXNlciB1c2Vyb3ZpY2giLCJjb250YWN0X251bWJlciI6IjA5OSA5OTkgOTk5OSIsInBhc3N3b3JkIjoiJDJhJDEwJGtUR2pGZXF3ODh5ZTdWbVJXdno0RmV6bW9raXdkWFZOYUNGcmp5blpxMHJ6NHhqbXluSXMyIiwiX2lkIjoiNTc3Zjk1YTQ1ODg4YmE2ODQ3MmJmYWRiIn0._wRkAlJdX-wAfxtD-a9douRkYSm1aZ3d_6xT_ycZoxY"
 *     }
 *
 * @apiSuccess (200) {Object} taskTicket
 *
 * @apiError (404) NotFound
 * @apiError (403) Forbidden invalid auth token
 */
app.get('/api/tasks/:task_id', require('./api-routes/task-tickets-api').getSingleTask);

/**
 * @api {put} /api/tasks/:task_id Replace task by new one.
 * @apiGroup TaskTickets
 *
 * @apiParam {String} task_id task's _id
 * @apiParam {Object} task new task
 *
 * @apiHeader {String} token jwt auth token
 * @apiHeaderExample {String} Header-Example:
 *     {
 *       "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwibmFtZSI6InRlc3QgdXNlciB1c2Vyb3ZpY2giLCJjb250YWN0X251bWJlciI6IjA5OSA5OTkgOTk5OSIsInBhc3N3b3JkIjoiJDJhJDEwJGtUR2pGZXF3ODh5ZTdWbVJXdno0RmV6bW9raXdkWFZOYUNGcmp5blpxMHJ6NHhqbXluSXMyIiwiX2lkIjoiNTc3Zjk1YTQ1ODg4YmE2ODQ3MmJmYWRiIn0._wRkAlJdX-wAfxtD-a9douRkYSm1aZ3d_6xT_ycZoxY"
 *       "content-type": "application/json"
 *     }
 *
 * @apiPermission admin
 *
 * @apiSuccess (200) {json} new task
 *
 * @apiError (400) BadRequest
 * @apiError (404) NotFound
 * @apiError (403) Forbidden invalid auth token
 */
app.put('/api/tasks/:task_id', require('./api-routes/task-tickets-api').replaceTaskByNew);

/**
 * @api {delete} /api/tasks/:task_id Delete task.
 * @apiGroup TaskTickets
 *
 * @apiParam {String} task_id task's _id
 *
 * @apiHeader {String} token jwt auth token
 * @apiHeaderExample {String} Header-Example:
 *     {
 *       "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwibmFtZSI6InRlc3QgdXNlciB1c2Vyb3ZpY2giLCJjb250YWN0X251bWJlciI6IjA5OSA5OTkgOTk5OSIsInBhc3N3b3JkIjoiJDJhJDEwJGtUR2pGZXF3ODh5ZTdWbVJXdno0RmV6bW9raXdkWFZOYUNGcmp5blpxMHJ6NHhqbXluSXMyIiwiX2lkIjoiNTc3Zjk1YTQ1ODg4YmE2ODQ3MmJmYWRiIn0._wRkAlJdX-wAfxtD-a9douRkYSm1aZ3d_6xT_ycZoxY"
 *     }
 *
 * @apiPermission admin
 *
 * @apiError (403) Forbidden invalid auth token
 * @apiError (404) NotFound
 */
app.delete('/api/tasks/:task_id', require('./api-routes/task-tickets-api').deleteSingleTask);

/**
 * @api {patch} /api/tasks/:task_id/task_text
 * @apiGroup TaskTickets
 *
 * @apiDescription JavaScript Object Notation (JSON) Patch  RFC 6902 compatible. <a href="http://jsonpatch.com/"></a>
 *
 * @apiParam {String} task_id task's _id
 * @apiParam {Object} changesDescription
 * @apiParamExample {json} Request-Example: { "op": "replace", "path": "/task_text", "value": "new task text" }
 * @apiParamExample {json} Request-Example: { "op": "replace", "path": "/task_status", "value": "finish-request" }
 *
 * @apiHeader {String} token jwt auth token
 * @apiHeaderExample {String} Header-Example:
 *     {
 *       "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwibmFtZSI6InRlc3QgdXNlciB1c2Vyb3ZpY2giLCJjb250YWN0X251bWJlciI6IjA5OSA5OTkgOTk5OSIsInBhc3N3b3JkIjoiJDJhJDEwJGtUR2pGZXF3ODh5ZTdWbVJXdno0RmV6bW9raXdkWFZOYUNGcmp5blpxMHJ6NHhqbXluSXMyIiwiX2lkIjoiNTc3Zjk1YTQ1ODg4YmE2ODQ3MmJmYWRiIn0._wRkAlJdX-wAfxtD-a9douRkYSm1aZ3d_6xT_ycZoxY"
 *     }
 *
 * @apiError (403) Forbidden invalid auth token
 * @apiError (404) NotFound
 */
app.patch('/api/tasks/:task_id/', require('./api-routes/task-tickets-api').editTask);


/** error handlers*/
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

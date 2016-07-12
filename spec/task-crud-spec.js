/**
 * Test Task Ticket CRUD
 *
 * @see <a href="https://www.npmjs.com/package/jasmine-node">jasmine for node</a>
 * @see <a href="https://www.npmjs.com/package/async">async</a>
 *
 * @author polesskiy
 */
const request = require("request");
const util = require('util');
const async = require('async');
const nconf = require('nconf');

// get test user obj
nconf.reset();
nconf.argv().env()
    .add('testUser', {type: 'file', file: 'spec/resources/test-users/test-user.json'})
    .add('adminUser', {type: 'file', file: 'spec/resources/test-users/admin-user.json'})
    .add('testFreeTask', {type: 'file', file: 'spec/resources/test-tasks/test-free-task.json'});

let testUser = nconf.get("testUser");
let adminUser = nconf.get("adminUser");
let testFreeTask = nconf.get("testFreeTask");

/** URL */
//auth
const BASE_URL = `http://localhost:3000`;
const REGISTRATION_URL = `${BASE_URL}/sign-up`;
const LOGIN_URL = `${BASE_URL}/sign-in`;
//user api
const USERS_API_URL = `${BASE_URL}/api/users`;
// const TEST_USER_URL = `${USERS_API_URL}/${testUser.login}`;
//task ticket api
const TASKS_API_URL = `${BASE_URL}/api/tasks`;

/**
 * Test Task Ticket CRUD.
 *
 * expect that admin user already exists in DB.
 */
describe("CRUD", function () {
    console.log("Test entities - adminUser: %j\r\ntest free task: %j", adminUser, testFreeTask);

    let adminAuthToken = "";

    /** create new test user*/
    beforeEach(function (done) {
        async.waterfall([
                /** register new test task*/
                    function (next) {
                    request.post({
                        headers: {'content-type': 'application/json'},
                        url: TASKS_API_URL,
                        body: JSON.stringify(testFreeTask)
                    }, next)
                },
                function (response, body, next) {
                    expect(response.statusCode).toBe(201);
                    console.log("Task ticket registered successfully, %s", body);
                    testFreeTask = JSON.parse(body);
                    next();
                },
                /** log in as admin*/
                    function (next) {
                    request.post({
                        headers: {'content-type': 'application/json'},
                        url: LOGIN_URL,
                        body: JSON.stringify(adminUser)
                    }, next)
                },
                function (response, body, next) {
                    adminAuthToken = JSON.parse(body).token;
                    expect(response.statusCode).toBe(200);
                    next(null, body);
                }],
            function (err, result) {
                expect(err).toBe(null);
                done();
            }
        );
    });

    /** delete recently created test task ticket */
    afterEach(function (done) {
        async.waterfall([
                function (next) {
                    request({
                        headers: {'Authorization': adminAuthToken},
                        method: 'DELETE',
                        url: `${TASKS_API_URL}/${testFreeTask._id}`
                    }, next)
                },
                function (response, body, next) {
                    expect(response.statusCode).toBe(200);
                    next(null, body);
                }],
            function (err, result) {
                expect(err).toBe(null);
                done();
            })
    });

    /** fetch single task*/
    it("GET single task ticket, returns status code 200",
        function (done) {
            async.waterfall([
                    function (next) {
                        request.get({
                            headers: {'Authorization': adminAuthToken},
                            url: `${TASKS_API_URL}/${testFreeTask._id}`
                        }, next);
                    },
                    function (response, body, next) {
                        console.log("Response for fetching single task: \r\n%s", body);
                        expect(response.statusCode).toBe(200);
                        next(null, body);
                    }],
                function (err, result) {
                    expect(err).toBe(null);
                    done();
                })
        });

    /** replace single task*/
    it("PUT - update single task", function (done) {
        //update email
        testFreeTask.name = "new task name";
        async.waterfall([
            function (next) {
                request.put({
                    headers: {
                        'Authorization': adminAuthToken,
                        'content-type': 'application/json'
                    },
                    url: `${TASKS_API_URL}/${testFreeTask._id}`,
                    body: JSON.stringify(testFreeTask)
                }, next);
            },
            function (response, body) {
                console.log("Response for updating single task: \r\n%s", body);
                expect(response.statusCode).toBe(200);
                done();
            }
        ]);
    });

    /** edit task_text field*/
    it("PATCH - edit single task text field", function (done) {
        async.waterfall([
            function (next) {
                request.patch({
                    headers: {
                        'Authorization': adminAuthToken,
                        'content-type': 'application/json'
                    },
                    url: `${TASKS_API_URL}/${testFreeTask._id}`,
                    body: JSON.stringify({
                        "op": "replace",
                        "path": "/task_text",
                        "value": "new task text"
                    })
                }, next);
            },
            function (response, body) {
                console.log("Response for patching single task text field: \r\n%s", body);
                expect(response.statusCode).toBe(200);
                done();
            }
        ]);
    });

    /** edit task_status field*/
    it("PATCH - edit single task task_status field", function (done) {
        async.waterfall([
            function (next) {
                request.patch({
                    headers: {
                        'Authorization': adminAuthToken,
                        'content-type': 'application/json'
                    },
                    url: `${TASKS_API_URL}/${testFreeTask._id}`,
                    body: JSON.stringify({
                        "op": "replace",
                        "path": "/task_status",
                        "value": "finished"
                    })
                }, next);
            },
            function (response, body) {
                console.log("Response for patching single task task_status field: \r\n%s", body);
                expect(response.statusCode).toBe(200);
                done();
            }
        ]);
    });

    /** get all users by admin account */
    it("GET all available task tickets", function (done) {
        let adminAuthToken = null;

        async.waterfall([
                /** get all users from server*/
                    function (next) {
                    request.get({
                        headers: {'Authorization': adminAuthToken},
                        url: TASKS_API_URL
                    }, next)
                },
                function (response, body, next) {
                    expect(response.statusCode).toBe(200);
                    next(null, body);
                }
            ],
            function (err, tasksArr) {
                expect(err).toBe(null);
                console.log("All task tickets from server:\r\n%s", tasksArr);
                done();
            }
        )
    })
});

/**
 * Database connection to mLab.
 *
 * @see {@link http://blog.mlab.com/2014/04/mongodb-driver-mongoose/}
 */
"use strict";
const mongoose = require('mongoose');
const log = require('../utils/logger')(module);
const nconf = require('nconf');

// read configuration
nconf.reset();
nconf.argv().env().file({file: 'config/database-config.json'});
const db = nconf.get("db-config");

/** mongodb URL to connect*/
const DB_URL = `mongodb://${db.credentials.user}:${db.credentials.password}@${db.credentials.host}:${db.credentials.port}/${db.credentials.name}`;

/**
 * Connect to Mongo DB by URL
 *
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 */
(function () {
    log.info("Trying to connect to DB by %s", DB_URL);

    /** connect to mLab*/
    mongoose.connect(DB_URL, db.options);

    var conn = mongoose.connection;

    //while error
    conn.on('error', ()=>log.log('error', "Error while connecting to DB: %s", DB_URL));

    //while connection opens successfully
    conn.once('open', ()=>log.info("Database connection established to %s", DB_URL));
})();
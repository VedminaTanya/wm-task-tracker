const winston = require('winston');

/**
 * Create logger transport.
 *
 * @see <a href="https://github.com/winstonjs/winston"></a>
 * @param module - module where logger event occurs
 * @returns {*} - logger instance (?)
 */
"use strict";
function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                label: path,
                timestamp: ()=> (new Date()).toISOString()
            })
        ]
    });
}

module.exports = getLogger;
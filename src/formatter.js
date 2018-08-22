'use strict';

let messages = require('./config').messages;

/**
 * format a string for correct output
 * @param {string} message
 * @param {object} [replaces]
 * @returns {string}
 */
module.exports = (message, replaces) => {
    if (messages[message]) {
        message = messages[message];
    }

    // replace data in message
    replaces && Object.keys(replaces).forEach(key => 
        message = message.replace('${' + key + '}', replaces[key])
    );

    return message;
};
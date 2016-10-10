"use strict";

var messages = require("../config/messages"); 

/**
 * format a string for correct output
 * @param {string} message
 * @param {object} [replaces]
 * @returns {string}
 */
module.exports = function(message, replaces) {
    // try to get message from config first
    if( messages[message] ) {
        message = messages[message];
    }

    // replace data in message
    if( replaces ) {
        for( var key in replaces ) {
            if( replaces.hasOwnProperty(key)) {
                message = message.replace("{" + key + "}", replaces[key]);
            }
        }
    }

    return message;
};
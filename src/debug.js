"use strict";

var config = require("../config/server");

/**
 * debug helper
 * @returns {void}
 */
module.exports = function() {
    if( config.debug ) {
        console.log.apply(this, arguments);
    }
};
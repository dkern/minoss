"use strict";

var config = require("./config").server;

/**
 * debug output helper
 * @returns {void}
 */
var debug = function() {
    if( config.debug ) {
        console.log.apply(this, arguments);
    }
};

/**
 * flush the whole require cache
 * @returns void
 */
debug.flushRequireCache = function() {
    Object.keys(require.cache).forEach(function(key) {
        delete require.cache[key];
    });

    debug("require cache flushed");
};

debug.enabled = config.debug;
module.exports = debug;
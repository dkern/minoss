'use strict';

let messages = require('./config').messages.debug;
let config = require('./config').server;
let _ = require('./formatter');

/**
 * debug output helper
 * @returns {void}
 */
let debug = function(message, replaces) {
    config.debug && console.log.apply(this, _(messages[message], replaces));
};

/**
 * flush the whole require cache
 * @returns void
 */
debug.flushRequireCache = () => {
    Object.keys(require.cache).forEach(key => delete require.cache[key]);
    debug('require cache flushed');
};

debug.enabled = config.debug;
module.exports = debug;

"use strict";

/**
 * collection of messages
 * @type {object}
 */
module.exports = {
    /**
     * default 404 error message
     * @type {string}
     */
    error404: "not found",

    /**
     * server started console output
     * @type {string}
     */
    serverStared: "Minoss now listening on http://localhost:{port} ...",

    /**
     * message when try to access a reserved name
     * @type {string}
     */
    moduleReversed: "module '{module}' is not available",

    /**
     * message when module folder was not found
     * @type {string}
     */
    moduleMissing: "module '{module}' not found",

    /**
     * message when script file in module folder was not found
     * @type {string}
     */
    scriptMissing: "script '{script}' not found",
};
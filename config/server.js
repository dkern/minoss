"use strict";

/**
 * express server configuration
 * @type {object}
 */
module.exports = {
    /**
     * port number to listen on
     * @type {number|string}
     */
    port: "8080",

    /**
     * name of the xml root tag
     * @type {string}
     */
    xmlRootTag: "root",

    /**
     * allows you to register own routes to server
     * @param {object} app
     * @type {function}
     */
    routes: function(app) {
        /**
         * example:
         *
         * app.get("/example", function(request, response) {
         *     res.send("example response");
         * });
         */
    }
};
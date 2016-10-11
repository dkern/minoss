"use strict";

var config = require("../config/server");
var xml = require("js2xmlparser");

/**
 * contains functions for responding data
 * out of the express server
 * @type {object}
 */
var response = {
    /**
     * name of the xml root node
     * @access private
     * @type {string}
     */
    xmlRootTag: config.xmlRootTag,

    /**
     * helper function for easy response
     * @param {object} req
     * @param {object} res
     * @param {string} string
     * @param {object} data
     * @param {number} [status]
     * @return void
     */
    output: function(req, res, string, data, status) {
        // correct response status for errors
        if( !status && !data.success && data.error ) {
            status = 404;
        }

        res.status(status || 200);

        // text
        if( req.query.output === "text" ) {
            res.type("text/plain");
            res.send(string);
        }

        // xml
        else if( req.query.output === "xml" ) {
            res.type("text/xml");
            //noinspection JSCheckFunctionSignatures
            res.send(xml.parse(response.xmlRootTag, data, {cdataInvalidChars: true}));
        }

        // json (default)
        else {
            res.type("application/json");
            res.send(JSON.stringify(data, null, 2));
        }
    },

    /**
     * helper function for easy error response
     * @param {object} req
     * @param {object} res
     * @param {string} message
     * @return void
     */
    error: function(req, res, message) {
        response.output(req, res, message, {success: false, error: message}, 404);
    }
};

module.exports = response;
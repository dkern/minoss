"use strict";

var config = require("../config/server");
var xml = require("xml");

/**
 * contains functions for responding data
 * out of the express server
 * @type {object}
 */
var response = {
    /**
     * name of the xml root node
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
            //noinspection JSAnnotator
            var obj = {[response.xmlRootTag]: []};

            // reformat object for xml
            for( var key in data ) {
                if( data.hasOwnProperty(key) ) {
                    //noinspection JSAnnotator
                    var node = {[key]: data[key]};
                    obj[response.xmlRootTag].push(node);
                }
            }

            res.type("text/xml");
            res.send(xml(obj, {declaration: true}));
        }

        // json (default)
        else {
            res.json(data);
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
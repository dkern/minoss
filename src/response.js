"use strict";

var fs = require("fs");
var xml = require("xml");
var _ = require("./formatter");

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
    xmlRootTag: "root",

    /**
     * handler for script requests
     * @param {object} req
     * @param {object} res
     * @returns {*}
     */
    handler: function(req, res) {
        var module = req.params.module;
        var script = req.params.script;
        var dir = "./" + module;
        var file = dir + "/" + script + ".js";

        // ignore system folders
        if( module === "config" || module === "node_modules" || module === "src" ) {
            return response.error(req, res, _("moduleReversed", {module: module}));
        }

        // check if module is installed as minoss plugin
        var available = false;
        try {
            require.resolve("minoss-" + module);
            available = true;
        } catch(e) {}

        if( !available ) {
            // check for directory / module
            try {
                if( !fs.lstatSync(dir).isDirectory() ) {
                    //noinspection ExceptionCaughtLocallyJS
                    throw new Error();
                }
            }
            catch(err) {
                return response.error(req, res, _("moduleMissing", {module: module}));
            }

            // check for file / script
            try {
                if( !fs.lstatSync(file).isFile() ) {
                    //noinspection ExceptionCaughtLocallyJS
                    throw new Error();
                }
            }
            catch(err) {
                return response.error(req, res, _("scriptMissing", {script: script}));
            }
        }

        // execute script and receive result
        require(available ? "minoss-" + module + "/" + script : "." + file)(
            req.query, 
            response.respondCallback.bind({req: req, res: res}),
            response.errorCallback.bind({req: req, res: res})
        );
    },

    /**
     * callback function for executed scripts
     * @access private
     * @param {object} result
     * @return void
     */
    respondCallback: function(result) {
        // handle success shortcut
        if( result === true ) {
            result = {success: true};
        }

        // handle fail shortcut
        if( result === false ) {
            result = {success: false};
        }

        // check if success property is set
        if( !result.hasOwnProperty("success") ) {
            result.success = false;
        }

        response.output(this.req, this.res, result.success ? "1" : "0", result);
    },

    /**
     * callback function for executed script
     * @param {object|string} result
     */
    errorCallback: function(result) {
        if( typeof result === "string" ) {
            result = {success: false, error: result};
        }

        // check if success property is set
        if( !result.hasOwnProperty("success") ) {
            //noinspection JSUndefinedPropertyAssignment
            result.success = false;
        }

        //noinspection JSUnresolvedVariable
        response.output(this.req, this.res, result.error, result, 404);
    },

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
"use strict";

var debug = require("./debug");
var autoloader = require("./autoloader");
var response = require("./response");
var fs = require("fs");
var _ = require("./formatter");

/**
 * contains functions for responding data
 * out of the express server
 * @type {object}
 */
var handler = {
    /**
     * handler for script requests
     * @param {object} req
     * @param {object} res
     * @returns {*}
     */
    request: function(req, res) {
        debug("--- REQUEST ----------");

        var module = req.params.module;
        var script = req.params.script;

        try {
            var moduleScript = autoloader.script(module, script);
            var moduleConfig = autoloader.config(module);

            // execute script and receive result
            require(moduleScript)(
                moduleConfig,
                req.query,
                handler.respond.bind({req: req, res: res}),
                handler.error.bind({req: req, res: res})
            );
        }
        catch( err ) {
            // error: module name reserved
            if( err.message === "moduleReserved" ) {
                return response.error(req, res, _(err.message, {module: module}));
            }

            // error: module missing
            if( err.message === "moduleMissing" ) {
                return response.error(req, res, _(err.message, {module: module}));
            }

            // error: module script missing
            if( err.message === "scriptMissing" ) {
                return response.error(req, res, _(err.message, {script: script}));
            }

            return response.error(req, res, err.message);
        }
    },

    /**
     * callback function for executed scripts
     * @access private
     * @param {object} result
     * @return void
     */
    respond: function(result) {
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
     * @access private
     * @param {object|string} result
     * @return void
     */
    error: function(result) {
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
    }
};

handler.response = response;
module.exports = handler;
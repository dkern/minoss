'use strict';

let debug = require('./debug');
let autoloader = require('./autoloader');
let response = require('./response');
let _ = require('./formatter');

/**
 * contains functions for responding data
 * out of the express server
 * @type {object}
 */
let handler = {
    /**
     * handler for script requests
     * @param {object} req
     * @param {object} res
     * @returns {*}
     */
    request: (req, res) => {
        let requestObj = req.method === 'GET' ? req.query : req.body;

        // store output format into params
        if (!requestObj.output) {
            requestObj.output = req.params.output || 'json';
        }

        let module = requestObj.module = req.params.module;
        let script = requestObj.script = req.params.script;

        // clean console on debug and track execution time
        if (debug.enabled) {
            console.time('execution');
            debug('initLine', {date: Date.now()});
            debug('handleRequest', {module: module, script: script});
        }

        try {
            let moduleScript = autoloader.script(module, script);
            let moduleConfig = autoloader.config(module);

            // execute script and receive result
            require(moduleScript)(
                moduleConfig,
                requestObj,
                handler.respond.bind({req: req, res: res}),
                handler.error.bind({req: req, res: res})
            );
        }
        catch (err) {
            // predefined messages
            if (err.message === 'moduleReserved' || err.message === 'moduleMissing' || err.message === 'scriptMissing') {
                return response.error(req, res, _(err.message, {module: module, script: script}));
            }

            return response.error(req, res, err.message);
        }
    },

    /**
     * response callback function for executed scripts
     * @access private
     * @param {object} result
     * @return void
     */
    respond: function(result) {
        // handle shorthand call
        if (result === true || result === false) {
            result = {success: result};
        }

        // check if success property is set
        if (!result.hasOwnProperty('success')) {
            result.success = false;
        }

        if (!result.success && result.error) {
            response.output(this.req, this.res, result.error, result, 404);
        }
        else {
            response.output(this.req, this.res, result.success ? '1' : '0', result);
        }

        // on debug flush the require cache after handling
        if (debug.enabled) {
            debug.flushRequireCache();
            console.timeEnd('execution');
        }
    },

    /**
     * error callback function for failed script
     * @access private
     * @param {object|string} result
     * @return void
     */
    error: function(result) {
        if (typeof result === 'string') {
            result = {success: false, error: result};
        }

        // check if success property is set
        if (!result.hasOwnProperty('success')) {
            // noinspection JSUndefinedPropertyAssignment
            result.success = false;
        }

        response.output(this.req, this.res, result.error || '0', result, 404);

        // on debug flush the require cache after handling
        if (debug.enabled) {
            debug.flushRequireCache();
            console.timeEnd('execution');
        }
    }
};

handler.response = response;
module.exports = handler;
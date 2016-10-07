"use strict";

var debug = require("./debug");
var path = require("path");
var fs = require("fs");
var cache = {};

/**
 * autoloader functions
 * @type {object}
 */
module.exports = {
    /**
     * allocates script file of a module
     * @param {string} module
     * @param {string} script
     * @returns {string}
     */
    script: function(module, script) {
        // try to receive information from cache
        if( cache[module] && cache[module].scripts[script] ) {
            debug("get file for '" + module + "/" + script + "' from cache: " + cache[module].scripts[script]);
            return cache[module].scripts[script];
        }

        var localModule = false;
        var localScript = false;
        var nodeModule = false;
        var nodeScript = false;

        var dir = "./" + module;
        var file = dir + "/" + script + ".js";

        // check for module directory
        try {
            if( !fs.lstatSync(dir).isDirectory() ) {
                //noinspection ExceptionCaughtLocallyJS
                throw new Error();
            }

            localModule = true;
        }
        catch(e) {
            debug("no local module '" + module + "' found");
        }

        // check for local script file
        if( localModule ) {
            try {
                if( !fs.lstatSync(file).isFile() ) {
                    //noinspection ExceptionCaughtLocallyJS
                    throw new Error();
                }

                localScript = true;
            }
            catch(e) {
                debug("no local module script for '" + module + "/" + script + "' found");
            }
        }

        // stop if local version was found
        if( localModule && localScript ) {
            // ignore system folders on local instances
            if( module === "config" || module === "node_modules" || module === "src" ) {
                debug("skip because module '" + module + "' is a reserved name");
                throw new Error("moduleReserved");
            }

            // create base cache entry
            cache[module] = {name: module, node: false, scripts: {}};
            cache[module].scripts[script] = "." + file;

            debug("local module script '" + module + "/" + script + "' found");
            return cache[module].scripts[script];
        }

        // check if module is installed as minoss plugin
        try {
            require.resolve("minoss-" + module);
            nodeModule = true;

            require.resolve("minoss-" + module + "/" + script);
            nodeScript = true;
        }
        catch(e) {
            if( !nodeModule ) {
                debug("no node module for 'minoss-" + module + "' found");
            }

            if( !nodeScript ) {
                debug("no node module script for 'minoss-" + module + "/" + script + "' found");
            }
        }

        // stop if local version was found
        if( nodeModule && nodeScript ) {
            // create base cache entry
            cache[module] = {name: "minoss-" + module, node: true, scripts: {}};
            cache[module].scripts[script] = "minoss-" + module + "/" + script;

            debug("node module script 'minoss-" + module + "/" + script + "' found");
            return cache[module].scripts[script];
        }

        // throw error for missing module
        if( !localModule && !nodeModule ) {
            debug("module '" + module + "' was not found");
            throw new Error("moduleMissing");
        }

        // throw error for missing module script
        if( !localScript && !nodeScript ) {
            debug("module '" + module + "/" + script + "' was not found");
            throw new Error("scriptMissing");
        }
    },

    /**
     * allocates module configs
     * @param {string} module
     * @return {object}
     */
    config: function(module) {
        // if module not already loaded return nothing
        if( !cache[module] ) {
            debug("module '" + module + "' was not loaded already, respond empty config");
            return {};
        }

        // try to receive information from cache
        if( cache[module].configs ) {
            debug("return module '" + module + "' config from cache");
            return cache[module].configs;
        }

        var configs = {};

        // get node module configs first
        try {
            var modulePath = require.resolve("minoss-" + cache[module].name);
            var moduleDir = path.dirname(modulePath);

            if( moduleDir ) {
                var nodeFiles = fs.readdirSync(moduleDir + '/config');

                for( var n in nodeFiles ) {
                    if( nodeFiles.hasOwnProperty(n) ) {
                        var nodeFileName = path.basename(nodeFiles[n], ".js");
                        configs[nodeFileName] = require("minoss-" + module + "/config/" + nodeFileName);
                        debug("found config '" + nodeFileName + "' for node module '" + module + "'");
                    }
                }
            }
        }
        catch(e) {
            debug("no node module configs for 'minoss-" + module + "' found");
        }

        // local module
        if( !cache[module].node ) {
            try {
                var localFiles = fs.readdirSync("./" + module + "/config");

                for( var l in localFiles ) {
                    if( localFiles.hasOwnProperty(l) ) {
                        var localFileName = path.basename(localFiles[l], ".js");
                        configs[localFileName] = require("../" + module + "/config/" + localFileName);
                        debug("found config '" + localFileName + "' for local module '" + module + "'");
                    }
                }
            }
            catch(e) {
                debug("no local module configs for '" + module + "' found");
            }
        }

        // local config override
        try {
            var overrideFiles = fs.readdirSync("./config/" + module);

            for( var o in overrideFiles ) {
                if( overrideFiles.hasOwnProperty(o) ) {
                    var overrideFileName = path.basename(overrideFiles[o], ".js");
                    configs[overrideFileName] = require("../config/" + module + "/" + overrideFileName);
                    debug("found override config '" + overrideFileName + "' for module '" + module + "'");
                }
            }
        }
        catch(e) {
            debug("no override module configs for '" + module + "' found");
        }

        cache[module].configs = configs;
        return configs;
    }
};
"use strict";

var fs = require("fs");

/**
 * locate the correct server configuration files
 * @param {string} name
 * @return {object|*}
 */
function configLocator(name) {
    // try local files first
    try {
        var localFolder = process.cwd() + "/config";
        var localFile = localFolder + "/" + name + ".js";

        if( fs.lstatSync(localFolder).isDirectory() && fs.lstatSync(localFile).isFile() ) {
            return require(localFile);
        }
    }
    catch(e) {}

    // try to get own files instead
    try {
        var config = require("minoss/config/" + name);
        return config;
    }
    catch(e) {}

    return {};
}

// export config files
module.exports = {
    messages: configLocator("messages"),
    routes: configLocator("routes"),
    server: configLocator("server")
};
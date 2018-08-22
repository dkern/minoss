'use strict';

let fs = require('fs');

/**
 * locate the correct server configuration files
 * @param {string} name
 * @return {object|*}
 */
let configLocator = name => {
    // try local files first
    try {
        let localFolder = process.cwd() + '/config';
        let localFile = localFolder + '/' + name + '.js';

        if (fs.lstatSync(localFolder).isDirectory() && fs.lstatSync(localFile).isFile()) {
            return require(localFile);
        }
    }
    catch(e) {}

    // try to get own files instead
    try {
        return require('minoss/config/' + name);
    }
    catch(e) {}

    return {};
};

// export config files
module.exports = {
    messages: configLocator('messages'),
    routes: configLocator('routes'),
    server: configLocator('server')
};
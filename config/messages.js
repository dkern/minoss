'use strict';

/**
 * collection of messages
 * @type {object}
 */
module.exports = {
    /**
     * default 404 error message
     * @type {string}
     */
    error404: 'unknown request',

    /**
     * server started console output
     * @type {string}
     */
    serverStared: 'Minoss now listens on http://${hostname}:${port} ...',

    /**
     * the selected port is actually in use
     * @type {string}
     */
    serverPortBusy: 'server port "${port}" is already in use',

    /**
     * server is about to shut down and stops listening
     * @type {string}
     */
    serverShutDown: 'Minoss is shutting down!',

    /**
     * message when try to access a reserved name
     * @type {string}
     */
    moduleReserved: 'module "${module}" is not available',

    /**
     * message when module folder was not found
     * @type {string}
     */
    moduleMissing: 'module "${module}" not found',

    /**
     * message when script file in module folder was not found
     * @type {string}
     */
    scriptMissing: 'script "${script}" not found',

    /**
     * collection of debug messages
     * @type {*}
     */
    debug: {
        initLine: '\x1Bc--- REQUEST --- ${date} ----------',
        handleRequest: 'handle request for "${module}/${script}"',
        scriptFromCache: '- get file for "${script}" from cache: ${cache}',
        noLocalModule: '- no local module "${module}" found',
        noLocalScript: '- no local script "${script}" for "${module}" found',
        reservedModule: '- skip because module "${module}" is a reserved name',
        localScriptFound: '- local module script "${script}" found',
        noNodeModule: '- no node module "${module}" found',
        noNodeScript: '- no node module script for "${script}" found',
        nodeScriptFound: '- node module script "${script}" found',
        unknownModule: '- module "${module}" was not found',
        unknownScript: '- script "${script}" was not found for "${module}"',
        moduleNotLoaded: '- module "${module}" was not loaded already, respond empty config',
        configFromCache: '- return module "${module}" config from cache',
        nodeConfigFound: '- config "${config}" for node module "${module}" found',
        noNodeConfig: '- no node module configs for "${module}" found',
        localConfigFound: '- config "${config}" for local module "${module}" found',
        noLocalConfig: '- no local module configs for "${module}" found',
        overwriteConfigFound: '- override config "${config}" for module "${module}" found',
        noOverwriteConfigs: '- no override module configs for "${module}" found'
    }
};
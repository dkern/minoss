'use strict';

let debug = require('./debug');
let path = require('path');
let fs = require('fs');

let cache = {};
let modulePrefix = 'minoss-';

/**
 * autoloader functions
 * @type {object}
 */
let autoloader = {
    /**
     * allocates script file of a module
     * @param {string} module
     * @param {string} script
     * @returns {string}
     */
    script: (module, script) => {
        // try to receive information from cache
        if (cache[module] && cache[module].scripts[script]) {
            debug('scriptFromCache', {script: module + '/' + script, cache: cache[module].scripts[script]});
            return cache[module].scripts[script];
        }

        let localModule = false,
            localScript = false;

        let dir = process.cwd() + '/' + module;
        let file = dir + '/' + script + '.js';

        // check for module directory
        try {
            if (!fs.lstatSync(dir).isDirectory()) {
                //noinspection ExceptionCaughtLocallyJS
                throw new Error();
            }

            localModule = true;
        }
        catch(e) {
            debug('noLocalModule', {module: module});
        }

        // check for local script file
        if (localModule) {
            try {
                if (!fs.lstatSync(file).isFile()) {
                    //noinspection ExceptionCaughtLocallyJS
                    throw new Error();
                }

                localScript = true;
            }
            catch(e) {
                debug('noLocalScript', {script: script, module: module});
            }
        }

        // stop if local version was found
        if (localModule && localScript) {
            // ignore system folders on local instances
            if (module === 'config' || module === 'node_modules' || module === 'src') {
                debug('reservedModule', {module: module});
                throw new Error('moduleReserved');
            }

            // create base cache entry
            cache[module] = {name: module, node: false, scripts: {}};
            cache[module].scripts[script] = file;

            debug('localScriptFound', {script: module + '/' + script});
            return cache[module].scripts[script];
        }

        let nodeModule = false;
        let nodeScript = false;

        // check if module is installed as minoss plugin
        try {
            require.resolve(modulePrefix + module);
            nodeModule = true;

            require.resolve(modulePrefix + module + '/' + script);
            nodeScript = true;
        }
        catch(e) {
            if (!nodeModule) {
                debug('noNodeModule', {module: modulePrefix + module});
            }
            else if (!nodeScript) {
                debug('noNodeScript', {script: modulePrefix + module + '/' + script});
            }
        }

        // stop if node version was found
        if (nodeModule && nodeScript) {
            // create base cache entry
            cache[module] = {name: modulePrefix + module, node: true, scripts: {}};
            cache[module].scripts[script] = modulePrefix + module + '/' + script;

            debug('nodeScriptFound', {script: modulePrefix + module + '/' + script});
            return cache[module].scripts[script];
        }

        // throw error for missing module
        if (!localModule && !nodeModule) {
            debug('unknownModule', {module: module});
            throw new Error('moduleMissing');
        }

        // throw error for missing module script
        else if (!localScript && !nodeScript) {
            debug('unknownScript', {script: script, module: module});
            throw new Error('scriptMissing');
        }
    },

    /**
     * allocates module configs
     * @param {string} module
     * @return {object}
     */
    config: module => {
        // if module not already loaded return nothing
        if (!cache[module]) {
            debug('moduleNotLoaded', {module: module});
            return {};
        }

        // try to receive information from cache
        if (cache[module].configs) {
            debug('configFromCache', {module: module});
            return cache[module].configs;
        }

        let configs = {};

        // get node module configs first
        try {
            let modulePath = require.resolve(cache[module].name);
            let moduleDir = path.dirname(modulePath);

            moduleDir && fs.readdirSync(moduleDir + '/config').forEach(file => {
                if (path.extname(file) === '.js') {
                    let nodeFileName = path.basename(file, '.js');
                    configs[nodeFileName] = require(modulePrefix + module + '/config/' + nodeFileName);
                    debug('nodeConfigFound', {config: nodeFileName, module: module});
                }
            });
        }
        catch(e) {
            debug('noNodeConfig', {module: modulePrefix + module});
        }

        // local module
        let localFiles = autoloader.configLocator(configs, process.cwd() + '/' + module + '/config');

        if (localFiles) {
            localFiles.map(file => debug('localConfigFound', {config: file, module: module}));
        }
        else {
            debug('noLocalConfig', {module: module});
        }

        // local config override
        let overrideFiles = autoloader.configLocator(configs, process.cwd() + '/config/' + module);

        if (overrideFiles) {
            overrideFiles.map(file => debug('overwriteConfigFound', {config: file, module: module}));
        }
        else {
            debug('noOverwriteConfigs', {module: module});
        }

        cache[module].configs = configs;
        return configs;
    },

    /**
     * helper function to locate and load config files
     * @access private
     * @param {object} configs
     * @param {string} filesDir
     * @returns {boolean|Array}
     */
    configLocator: (configs, filesDir) => {
        try {
            let loaded = [];

            fs.readdirSync(filesDir).forEach(file => {
                if (path.extname(file) === '.js') {
                    let fileName = path.basename(file, '.js');
                    configs[fileName] = require(filesDir + '/' + fileName);
                    loaded.push(fileName);
                }
            });

            return loaded.length ? loaded : false;
        }
        catch(e) {}

        return false;
    }
};

module.exports = autoloader;
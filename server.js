/**
 * Minoss - Mini Node Script Server - v0.1.9
 * https://github.com/eisbehr-/minoss
 * 
 * Copyright 2016-2018, Daniel 'Eisbehr' Kern
 * 
 * Dual licensed under the MIT and GPL-2.0 licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 */

'use strict';

let os       = require('os');
let app      = require('express')();
let parser   = require('body-parser');
let config   = require('./src/config').server;
let routes   = require('./src/config').routes;
let handler  = require('./src/handler');
let _        = require('./src/formatter');
let response = handler.response;
let port     = config.port || 8080;

// handle request data else than GET
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));


// register custom routes
routes(app);

// register module-script route with desired output format
app.all('/:output(xml|text|json)/:module([a-z-]+)/:script([a-z-]+)', handler.request);

// register default module-script routes
app.all('/:module([a-z-]+)/:script([a-z-]+)', handler.request);

// register 404 not found route
app.all('*', (req, res) => response.error(req, res, _('error404')));


// start server 
let instance = app.listen(port, () => {
    console.log(_('serverStared', {hostname: os.hostname(), port: port}));
})
.on('error', err => {
    console.log(err.errno === 'EADDRINUSE' ? _('serverPortBusy', {port: port}) : err);
});

// stop server
process.on('SIGINT', () => {
    console.log(_('serverShutDown'));
    instance.close();
    setTimeout(() => process.exit(0), 200);
});

exports = module.exports = app;
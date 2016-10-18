/**
 * Minoss - Mini Node Script Server - v0.1.2
 * https://github.com/eisbehr-/minoss
 * 
 * Copyright 2016, Daniel 'Eisbehr' Kern
 * 
 * Dual licensed under the MIT and GPL-2.0 licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 */

"use strict";

var os       = require("os");
var app      = require("express")();
var parser   = require("body-parser");
var config   = require("./src/config").server;
var routes   = require("./src/config").routes;
var handler  = require("./src/handler");
var _        = require("./src/formatter");
var response = handler.response;
var port     = config.port || 8080;

// handle request data else than GET
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

// register custom routes
routes(app);

// register module-script route with desired output format
app.all("/:output(xml|text|json)/:module([a-z]+)/:script([a-z]+)", handler.request);

// register default module-script routes
app.all("/:module([a-z]+)/:script([a-z]+)", handler.request);

// register 404 not found route
app.all("*", function(req, res) {
    response.error(req, res, _("error404"));
});

// start server 
app.listen(port, function() {
    console.log(_("serverStared", {hostname: os.hostname(), port: port}));
})
.on("error", function(err) {
    if( err.errno === "EADDRINUSE" ) {
        console.log(_("serverPortBusy", {port: port}));
    }
    else {
        console.log(err);
    }
});

exports = module.exports = app;
"use strict";

var app      = require("express")();
var config   = require("./config/server");
var response = require("./src/response");
var _        = require("./src/formatter");

// pass output config
response.xmlRootTag = config.xmlRootTag;

// register custom routes
config.routes(app);

// register module-script route with desired output format
app.get("/:output(xml|text|json)/:module([a-z]+)/:script([a-z]+)", function(req, res) {
    if( !req.query.output ) {
        req.query.output = req.params.output;
    }

    response.handler(req, res);
});

// register default module-script routes
app.get("/:module([a-z]+)/:script([a-z]+)", response.handler);

// register 404 not found route
app.get("*", function(req, res) {
    response.error(req, res, _("error404"));
});

// start server
app.listen(config.port || 8080);
console.log(_("serverStared", {port: config.port || 8080}));
exports = module.exports = app;
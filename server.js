"use strict";

var app = require("express")();
var config = require("./config/server");
var handler = require("./src/handler");
var _ = require("./src/formatter");

var response = handler.response;
var port = config.port || 8080;

// register custom routes
config.routes(app);

// register module-script route with desired output format
app.get("/:output(xml|text|json)/:module([a-z]+)/:script([a-z]+)", function(req, res) {
    // store output format into params
    if( !req.query.output ) {
        req.query.output = req.params.output;
    }

    handler.request(req, res);
});

// register default module-script routes
app.get("/:module([a-z]+)/:script([a-z]+)", handler.request);

// register 404 not found route
app.get("*", function(req, res) {
    response.error(req, res, _("error404"));
});

// start server 
app.listen(port, function() {
    console.log(_("serverStared", {port: port}));
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
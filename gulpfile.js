"use strict";

var gulp   = require("gulp");
var jshint = require("gulp-jshint");
var paths = {
    all: [
        "**/*.js",
        "!**/node_modules/**/*.js"
    ],
    modules: [
        "**/*.js",
        "!config/**/*.js",
        "!**/node_modules/**/*.js",
        "!src/**/*.js",
        "*.js"
    ]
};



/*
** pipes
*/



var pipes  = {};

// check module files only
pipes.validate = function() {
    return gulp.src(paths.modules)
               .pipe(jshint())
               .pipe(jshint.reporter("jshint-stylish"));
};

// check all files
pipes.validateAll = function() {
    return gulp.src(paths.all)
               .pipe(jshint())
               .pipe(jshint.reporter("jshint-stylish"));
};



/*
** tasks
*/



// check module files only
gulp.task("validate", pipes.validate);

// check module files only
gulp.task("validateAll", pipes.validateAll);

// check live changes on module files and validate
gulp.task("watch", function() {
    gulp.watch(paths.modules, function() {
        return pipes.validate();
    });
});
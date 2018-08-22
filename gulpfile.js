'use strict';

let gulp = require('gulp');
let jshint = require('gulp-jshint');

/**
 * path configuration for validating files
 * @type {*}
 */
let paths = {
    all: [
        '**/*.js',
        '!**/node_modules/**/*.js'
    ],
    modules: [
        '**/*.js',
        '!config/**/*.js',
        '!**/node_modules/**/*.js',
        '!src/**/*.js',
        '*.js'
    ]
};



// pipes

let pipes  = {};

// check all files
pipes.validateAll = () =>
    gulp.src(paths.all)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

// check module files only
pipes.validate = () =>
    gulp.src(paths.modules)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));



// tasks

// validate all files
gulp.task('validateAll', pipes.validateAll);

// validate module files only
gulp.task('validate', pipes.validate);

// watch live changes on module files and validate them
gulp.task('watch', () => {
    gulp.watch(paths.modules, () => pipes.validate());
});
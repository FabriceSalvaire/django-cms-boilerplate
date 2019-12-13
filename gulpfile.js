/*
 * Copyright (c) 2013, Divio AG
 * Licensed under BSD
 * http://github.com/aldryn/aldryn-boilerplate-bootstrap3
 */

/*
 * Gulp Task Manager settings
 *
 * Documentation https://gulpjs.com
 * https://www.liquidlight.co.uk/blog/how-do-i-update-to-gulp-4
 */

'use strict';

// #############################################################################
// IMPORTS
var webdriverUpdate;
var argv = require('minimist')(process.argv.slice(2));
var gulp = require('gulp');

// #############################################################################
// SETTINGS
var PROJECT_ROOT = __dirname;
var PROJECT_PATH = {
    bower: PROJECT_ROOT + '/static/vendor',
    css: PROJECT_ROOT + '/static/css',
    html: PROJECT_ROOT + '/templates',
    images: PROJECT_ROOT + '/static/img',
    js: PROJECT_ROOT + '/static/js',
    sass: PROJECT_ROOT + '/private/sass',
    fonts: PROJECT_ROOT + '/static/fonts', // Doesn't exists !!!
    icons: PROJECT_ROOT + '/private/icons', // Doesn't exists !!!
};

var PROJECT_PATTERNS = {
    images: [
        PROJECT_PATH.images + '/**/*',
        // exclude from preprocessing
        '!' + PROJECT_PATH.images + '/dummy/*/**'
    ],
    js: [
        'gulpfile.js',
        './tools/tasks/**/*.js',
        PROJECT_PATH.js + '/**/*.js',
        PROJECT_PATH.tests + '/**/*.js',
        // exclude from linting
        '!' + PROJECT_PATH.js + '/*.min.js',
        '!' + PROJECT_PATH.js + '/**/*.min.js',
        '!' + PROJECT_PATH.tests + '/coverage/**/*'
    ],
    sass: [
        PROJECT_PATH.sass + '/**/*.{scss,sass}'
    ]
};

var DEFAULT_PORT = 8000;
var PORT = parseInt(process.env.PORT, 10) || DEFAULT_PORT;
var DEBUG = argv.debug;


/**
 * Checks project deployment
 * @param {String} id - task name
 * @returns {Object} - task which finished
 */
function task (id) {
    return require('./tools/tasks/' + id)(gulp, {
        PROJECT_ROOT: PROJECT_ROOT,
        PROJECT_PATH: PROJECT_PATH,
        PROJECT_PATTERNS: PROJECT_PATTERNS,
        DEBUG: DEBUG,
        PORT: PORT
    });
}

// gulp.task('bower', task('bower'));
// gulp.task('lint:javascript', gulp.series('lint/javascript'));
// gulp.task('lint', gulp.series('lint:javascript'));
gulp.task('sass', task('sass'));
gulp.task('build', gulp.series('sass'));

/**
 * GULP_MODE === 'production' means we have a limited
 * subset of tasks, namely sass, bower and lint to
 * speed up the deployment / installation process.
 */
if (process.env.GULP_MODE !== 'production') {
    gulp.task('images', task('images'));
    gulp.task('preprocess', gulp.series('sass', 'images')); // , 'docs'
    gulp.task('icons', task('icons'));

    gulp.task('browser', task('browser'));

    // ???
    webdriverUpdate = require('gulp-protractor').webdriver_update;
    gulp.task('tests:webdriver', webdriverUpdate);
}

gulp.task('watch', function () {
    gulp.watch(PROJECT_PATTERNS.sass, ['sass']);
    gulp.watch(PROJECT_PATTERNS.js, ['lint']);
});

//gulp.task('default', ['bower', 'sass', 'lint', 'watch']);
// removed bower !!!
gulp.task('default', gulp.series('sass', 'watch'));

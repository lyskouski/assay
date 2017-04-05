/**
 * Run JavaScript tests by using Karma (Jasmine)
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */

// Gulp initialization
var gulp = require('gulp');
// Server init
var server = require('karma').Server;

// Gulp task 'test' run
gulp.task('test', function (callback) {
    new server({
        configFile: __dirname + '/../tests/js/karma.conf.js',
        // test results reporter to use
        //reporters: 'teamcity',
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        // Continuous Integration mode (Karma captures browsers, runs the tests and exits)
        singleRun: true
    }, callback).start();
});
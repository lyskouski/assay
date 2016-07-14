/**
 * Build project
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */

// Gulp initialization
var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function (callback) {
    runSequence(
        'css',
        'js',
        callback
    );
    console.log('Build compiled!');
});
/**
 * Build project
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */

// Gulp initialization
var gulp = require('gulp');
var change = require('gulp-change');
var runSequence = require('run-sequence');

gulp.task('build', function (callback) {
    var sources = require('./params/minify.json');

    // Update version and timestamp
    console.log('* updating timestamp');
    var jsonPath = './config/task/params/';
    gulp.src(jsonPath + 'minify.json')
        .pipe(change(function () {
            for (var i in sources) {
                sources[i].datetime = (new Date).getTime();
            }
            return JSON.stringify(sources, {}, "    ");
        }))
        .pipe(gulp.dest(jsonPath));

    // Build release (@note: `css`, `js` cannot be triggered in parallel)
    runSequence(
        'sass',
        'css',
        'js',
        'image',
        callback
    );
    console.log('Build compiled!');
});
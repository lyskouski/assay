/**
 * Build project
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */

// Gulp initialization
var gulp = require('gulp');

gulp.task('build', ['css', 'js'], function () {
    console.log('Build compiled!');
});
/**
 * Changes observer
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */

// Gulp initialization
var gulp = require('gulp');

// Task for automated changes observer
gulp.task('watch', function () {
    gulp.watch('public/css/**/*', function () {
        gulp.start('css');
    });

    gulp.watch('public/js/**/*', function () {
        gulp.start('js');
    });
});
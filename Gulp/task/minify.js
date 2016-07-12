/**
 * Minify files
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */

// Specify public directory with css, js folders
var publicDir = '{path}';

// Gulp initialization
var gulp = require('gulp');
var del = require('del');
var min = {
    js: require('gulp-uglify'),
    css: require('gulp-cssmin')
};
var concat = require('gulp-concat');

// Sources
var sources = require('./json/minify.json');
// Files group extension
var extBuild = [];

// Minify JavaScript
gulp.task('js', function () {
    extBuild.push('js');
    return gulp.run('minify');
});

// Minify CSS
gulp.task('css', function () {
    extBuild.push('css');
    return gulp.run('minify');
});

// Common task to min/concat files
gulp.task('minify', function () {
    var ext = extBuild.pop();
    if (!ext) {
        throw Error('Missing extension! Use: gulp (js|css)');
    }
    console.log('[!] Minify task: ', ext);

    var folder = publicDir + ext;
    var minFolder = folder + '.min';
    del([
        minFolder + '/**/*' // pattern to match everything inside the folder
    ]).then(function () {
        for (var name in sources) {
            var list = [];
            // Bind list
            console.log('Concat ' + ext + ' `' + name + '`:');
            sources[name][ext].forEach(function (path) {
                var tgt = (folder + '/' + path).split('/');
                while (~tgt.indexOf('..')) {
                    tgt.splice(tgt.indexOf('..')-1, 2);
                }
                console.log('- ', tgt.join('/'));
                list.push(tgt.join('/'));
            });

            gulp.src(list)
                // Minify list of files
                .pipe(min[ext]())
                // Concatenate files
                .pipe(concat(name + '.' + ext))
                // Destination folder
                .pipe(gulp.dest(minFolder));

            // Udate datetime in JSON file, as an example for PHP identicator
            // sources[name].datetime = (new Date).getTime();
        }
    });


});
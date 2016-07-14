/**
 * Minify files
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */

// Specify public directory with css, js folders
var publicDir = 'public/';

// Gulp initialization
var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var min = {
    js: require('gulp-uglify'),
    css: require('gulp-cssmin')
};
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');

// Sources
var sources = require('./params/minify.json');
// Files group extension
var ext = '';

// Minify JavaScript
gulp.task('js-init', function (callback) {
    ext = 'js';
    callback();
});
gulp.task('js', function (callback) {
    return runSequence(
        'js-init',
        'cleanup',
        ['minify', 'minify-all'],
        'minify-gzip',
        callback
    );
});

// Minify CSS
gulp.task('css-init', function (callback) {
    ext = 'css';
    callback();
});
gulp.task('css', function (callback) {
    return runSequence(
        'css-init',
        'cleanup',
        ['minify', 'minify-all'],
        'minify-gzip',
        callback
    );
});

// Clear directory
gulp.task('cleanup', function () {
    if (!ext) {
        throw Error('Missing extension! Use: gulp (js|css)');
    }
    console.log('[!] Cleanuo: ', ext);

    return del([
        publicDir + ext + '.min/**/*'
    ]);
});

// Compress minified files
gulp.task('minify-gzip', function () {
    if (!ext) {
        throw Error('Missing extension! Use: gulp (js|css)');
    }
    console.log('[!] Compress ALL: ', ext);

    var folder = publicDir + ext + '.min';
    return gulp.src(folder + '/**/*.' + ext)
            .pipe(gzip())
            .pipe(gulp.dest(folder));
});

// Minify grouped CSS
gulp.task('minify-all', function () {
    if (!ext) {
        throw Error('Missing extension! Use: gulp (js|css)');
    }
    console.log('[!] Minify ALL: ', ext);

    var folder = publicDir + ext;
    return gulp.src(folder + '/**/*.' + ext)
            .pipe(min[ext]())
            .pipe(gulp.dest(folder + '.min/' + sources.default.version));
});

// Common task to min/concat files
gulp.task('minify', function (callback) {
    // var ext = extBuild.pop();
    if (!ext) {
        throw Error('Missing extension! Use: gulp (js|css)');
    }
    console.log('[!] Minify: ', ext);

    var folder = publicDir + ext;
    var minFolder = folder + '.min';
    for (var name in sources) {
        var list = [];
        // Bind list
        console.log('Concat ' + ext + ' `' + name + '`:');
        sources[name][ext].forEach(function (path) {
            // ! - is used on backend to exclude files from adding into scope, or add special files only for minimized version
            // @example [extJs]: "!min.js" => Ext.Loader.setConfig({enabled: false});
            var tgt = (folder + '/' + path.replace('!', '')).split('/');
            while (~tgt.indexOf('..')) {
                tgt.splice(tgt.indexOf('..') - 1, 2);
            }
            console.log('- ', tgt.join('/'));
            list.push(tgt.join('/'));
        });
        // Join files
        gulp.src(list)
                // Concatenate files
                .pipe(concat(name + '.' + ext))
                // Minify list of files
                .pipe(min[ext]())
                // Destination folder
                .pipe(gulp.dest(minFolder));
    }
    // This is what lets gulp know this task is complete!
    callback();

});
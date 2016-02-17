var path = {
    src         : 'src',
    dist        : 'dist',
    tmp         : '.tmp',
    srcStyles   : 'src/assets/sass',
    distStyles  : 'dist/assets/css',
    srcScripts  : 'src/assets/js',
    distScripts : 'dist/assets/js',
    srcImages   : 'src/images',
    distImages  : 'dist/images'
};


var gulp        = require('gulp'),
    browsersync = require('browser-sync'),
    colors      = require('colors'),
    beep        = require('beepbeep'),
    del         = require('del'),
    cp          = require('child_process'),
    runSequence = require('run-sequence'),
    sass        = require('gulp-sass'),
    plumber     = require('gulp-plumber');


// ERROR HANDLER ========================================
var onError = function(err) {
    beep([200, 200]);
    console.log(
        '\n*****************' + ' \\(°□°)/ '.bold.red + '<( ERROR! ) '.bold.blue + '*****************\n\n' +
        String(err) +
        '\n*******************************************************\n' );
    this.emit('end');
};


// CLEAN ================================================
gulp.task('clean', function(callback) {
    del(
        [ path.tmp, path.dist + '/*' ],
        function(err, deletedFiles) {
            console.log('Files deleted:\n'.bold.green , deletedFiles.join(',\n '));
            callback();
    });
});

gulp.task('copy-html', function() {
    return gulp.src( path.src + '/**/**.html')
        .pipe(gulp.dest( path.dist ));
});
gulp.task('html', ['copy-html'], function() {
    return browsersync.reload();
});


// STYLES ===============================================
gulp.task('styles', function() {
    gulp.src( path.srcStyles + '/**/*.scss' )
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(gulp.dest( path.distStyles ));
});


// SCRIPTS ==============================================
gulp.task('js', function() {
    gulp.src( path.srcScripts + '/**/*js' )
        .pipe(gulp.dest( path.distScripts ));
});


// IMAGES ===============================================
gulp.task('images', function() {
    return gulp.src( path.srcImages + '/**/**.{png,gif,jpg,svg}')
        .pipe(gulp.dest( path.distImages ));
});


// BROWSER SYNC =========================================
gulp.task('browsersync', function() {
    browsersync({
        server: { baseDir: path.dist },
        port: 8000,
        files: [
            path.distStyles + '/*.css',
            path.distScripts + '**/*.js'
        ]
    })
});


// WATCH ================================================
gulp.task('watch', ['browsersync'], function() {
    gulp.watch( path.src + '/**/*.{html,yml}',           ['html'] );
    gulp.watch( path.srcStyles + '/**/*.scss',          ['styles'] );
    gulp.watch( path.srcScripts + '/**/*.js',               ['js'] );
    gulp.watch( path.srcImages + '/**/*.{png,gif,jpg,svg}',['images'] );
});


// BUILD ================================================
gulp.task('build', function(callback) {
    runSequence(
        'clean',
        [
            'html',
            'styles',
            'js',
            'images'
        ],
    callback);
});

gulp.task('default', function(callback) {
    runSequence(
        'build',
        ['watch'],
    callback);
});
/*
This is a gulp script using browserSync and sass with autoprefixer in order to create a more
productive workflow and generating each change automaticaly in the browser without needing to
refresh each time. It also generates the .css files from .sass and prefixes any specific prefixes.
*/

var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cp = require('child_process');

gulp.task('site-rebuild', function () {
    browserSync.reload();
});

gulp.task('browser-sync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: 'www'
        },
        notify: false
    });
});

gulp.task('sass', function () {
    return gulp.src('www/css/index.scss')
        .pipe(sass({
            includePaths: ['sass'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('www/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('www/css'));
});

gulp.task('watch', function () {
    gulp.watch('www/css/**', ['sass']);
    gulp.watch('www/sass/**', ['sass']);
    gulp.watch(['www/**'], ['site-rebuild']);
});

gulp.task('default', ['browser-sync', 'watch']);

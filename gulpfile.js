'use strict';
var gulp = require('gulp');
var template = require('gulp-template');

var fs = require('fs');


gulp.task('default', function () {

    var data = fs.readFileSync('./env.json', 'utf-8');

    var parsedData = JSON.parse(data);
    return gulp.src(['./keen.dashboard.js', './app.js'])
        .pipe(template(parsedData))
        .pipe(gulp.dest('./out'));

});
gulp.task('watch', ['default'], function() {
    gulp.watch(['./keen.dashboard.js', './app.js'], ['default']);
});
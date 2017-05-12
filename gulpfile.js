"use strict";

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('inject', function() {
	var wiredep = require('wiredep').stream;
	var gulpinject = require('gulp-inject');

	var injectSrc = gulp.src(['./resources/css/*.css', './resources/js/*.js'], {
		read: false
	});

	var options = {
		ignorePath: '../../resources'
	};

	var injectOptions = {
		ignorePath: '/resources'
	};

	return gulp.src('./src/views/*.ejs')
		.pipe(wiredep(options))
		.pipe(gulpinject(injectSrc, injectOptions))
		.pipe(gulp.dest('./src/views/'));
});

gulp.task('serve', ['inject'], function() {
	var options = {
		script: './server.js',
		deplayTime: 1,
		env: {
			'PORT': 3000
		},
		watch: jsFiles
	};

	return nodemon(options)
	.on('restart',function(ev){
		console.log('Restarting ...');
	})
});
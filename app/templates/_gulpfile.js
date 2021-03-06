'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

// Load plugins
var $ = require('gulp-load-plugins')();


gulp.task('styles', function() {
  var browsers = [
    '> 1%',
    'last 2 versions',
    'Firefox ESR',
    'Opera 12.1'
  ];
  return gulp.src('app/**/*.less')
    .pipe($.less({
      paths: ['bower_components']
    })
    .on('error', $.util.log))
    .pipe($.postcss([
        require('autoprefixer-core')({
          browsers: browsers
        })
      ]))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('views', function(){
  return gulp.src([
      './index.html',
      './app/**/*.html'
    ])    
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe($.imagemin({
      svgoPlugins: [{
        convertPathData: false
      }]
    }))
    .pipe(gulp.dest('build/images'));
});


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './build'
    }
  });
});


gulp.task('watch', ['build'], function() {
  gulp.watch('app/**/*.less', ['styles']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch(['./app/**/*.html'], ['views']);

  gulp.start('browser-sync');
});

// JSHint grunfile.js
gulp.task('selfcheck', function() {
  return gulp.src('gulpfile.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.jshint.reporter('fail'));
});


gulp.task('clean', function(cb) {
  var del = require('del');
  del(['build'], cb);
});


gulp.task('build', ['styles', 'views', 'images']);


gulp.task('default', ['clean'], function() {
  gulp.start('watch');
});

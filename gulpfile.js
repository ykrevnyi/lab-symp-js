'use strict';

var fs = require('fs');
var clean = require('gulp-clean');
var nodemon = require('nodemon');
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var plumber = require('gulp-plumber');
var coveralls = require('gulp-coveralls');
var shell = require('gulp-shell');
var isWin = /^win/.test(process.platform);
var jshint = require('gulp-jshint');

gulp.task('start', function () {
  nodemon({
    script: 'index.js',
    env: {
      'NODE_ENV': 'development'
    },
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      process.stdout.write(chunk);
    });
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('lint', function () {
  return gulp.src(['**/*.js', '!gulpfile.js'])
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('pre-test', function () {
  return gulp.src('lib/**/*.js')
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  process.env.NODE_ENV = 'testing';

  gulp.src(['index.js', 'test/**/*.js'], {
      read: false
    })
    // .pipe(shell('clear'))
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
      process.exit();
    });
});

gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('default', ['static', 'test', 'coveralls']);


gulp.task('tdd', function () {
  return gulp.watch(['test/**/*.js', 'app/**/*.js', '*.js'], ['runMocha']);
});

gulp.task('runMocha', function () {
  process.env.NODE_ENV = 'testing';

  return gulp.src([
      'index.js',
      'test/**/*.js'
    ], {
      read: false
    })
    .pipe(shell(isWin ? 'cls' : 'clear'))
    .pipe(mocha({
      reporter: 'spec'
    }));
});

'use strict';

const gulp         = require('gulp');
const pug          = require('gulp-pug');
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const browserSync  = require('browser-sync').create();
const del          = require('del');
const stylus       = require('gulp-stylus');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const flexboxfixer = require('postcss-flexboxfixer');
const mqpacker     = require('css-mqpacker');
const cssnano      = require('cssnano');
const rename       = require('gulp-rename');

const fs           = require('fs');

gulp.task('pug', function() {
  return gulp.src('src/pug/**/*.pug')
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        sound: 'notwork'
      })
    }))

  .pipe(pug({
      locals: {
        site: {
          data: JSON.parse(fs.readFileSync('src/pug/data.json', 'utf8'))
        }
      },
      pretty: true
    }))
    .pipe(gulp.dest('build/'))
    .pipe(notify({
      message: 'Pug complite: <%= file.relative %>!',
      sound: 'Pop'
    }));
});



gulp.task('style', function() {
  return gulp.src('src/stylus/style.styl')
  .pipe(plumber({
    errorHandler: notify.onError({
      message: 'Error: <%= error.message %>',
      sound: 'notwork'
    })
  }))
  .pipe(stylus())
  .pipe(postcss([
    flexboxfixer,
    autoprefixer({browsers: ['last 2 version']}),
    mqpacker,
    cssnano({safe:true})
    ]))
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/'))
  .pipe(notify({
    message:'Style complite: <%= file.relative %>!',
    sound: 'Pop'
  }));
});



gulp.task('clean',function() {
  return del('build/');
});

gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: 'build/'
    },
    notify: false,
    open: false,
    ui: false
  });
  browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});



gulp.task('build', gulp.series('clean','pug','style'));


gulp.task('watch', function() {
  gulp.watch(['src/pug/**/*.pug', 'src/pug/**/*.json'], gulp.series('pug'));
  gulp.watch('src/stylus/**/*.styl', gulp.series('style'));
});

gulp.task('default', gulp.series('build', gulp.parallel('watch','server')));


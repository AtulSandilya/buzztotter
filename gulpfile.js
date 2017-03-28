var gulp = require('gulp');
var ts = require('gulp-typescript');
var changed = require('gulp-changed');

// Typescript Incremental Compile ---------------------------------------{{{

var tsProject = ts.createProject('tsconfig.json')

gulp.task('incremental-tsc', function() {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(changed('build', {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest('build'));
})

// End Typescript Incremental Compile -----------------------------------}}}

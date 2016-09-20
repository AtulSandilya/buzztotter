var gulp = require('gulp');
var bump = require('gulp-bump');
var git = require('gulp-git');
var filter = require('gulp-filter');
var tag_version = require('gulp-tag-version');
var semver = require('semver');
var prompt = require('gulp-prompt');

function increment(importance){
  var bumpedVersion = semver.inc(require('./package.json').version, importance);

  gulp.src('./package.json')
  .pipe(bump({type: importance}))
  .pipe(gulp.dest('./'))
  .pipe(prompt.prompt({
    type: 'input',
    name: 'commitNote',
    message: 'What features are included in this version:'
  }, function(res){
    gulp.src('./package.json')
      .pipe(git.commit(bumpedVersion + ": " + res.commitNote))
      .pipe(filter('package.json'))
      .pipe(tag_version());
  }))
}

gulp.task('patch', function() { return increment('patch'); })
gulp.task('feature', function() { return increment('minor'); })
gulp.task('release', function() { return increment('major'); })

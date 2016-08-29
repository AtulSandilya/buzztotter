var gulp = require('gulp')
var bump = require('gulp-bump')

gulp.task('bump', function(){
  gulp.src('./src/Global.js')
  .pipe(bump({type: 'patch'}))
  .pipe(gulp.dest('./src'));
})

var gulp = require('gulp');
var sass = require('gulp-sass');

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('src/js/**.js', ['scripts']);
  gulp.watch('src/examples/scss/**.scss', ['examples']);
  gulp.watch('src/examples/*.html', ['examples']);
});

gulp.task('examples', function() {
  gulp.src('node_modules/bootstrap/dist/js/*.min.js')
    .pipe(gulp.dest('examples/js'));
  gulp.src('node_modules/bootstrap/dist/css/*.min.css')
    .pipe(gulp.dest('examples/css'));
  gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('examples/js'));

  gulp.src('src/examples/*.html')
    .pipe(gulp.dest('examples'));
  return gulp.src('src/examples/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('examples/css'));
});

gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['examples', 'scripts'], function() {
  // place code for your default task here
});
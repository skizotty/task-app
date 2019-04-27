var gulp = require('gulp');
var exec = require('child_process').exec;
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
var browsersync = require('browser-sync');


gulp.task('server', function (cb) {
  return exec('node index.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('sass', function() {
	return gulp.src('scss/*.scss')
		.pipe(sourcemaps.init())
			.pipe(sass({
				outputStyle: 'expanded'
			}))
			.pipe(prefix({
				browsers: ['last 2 versions'],
				cascade: false
			}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/css'))
		.pipe(browsersync.reload({
			stream: true
		}))
});

gulp.task('browsersync', function() {
	browsersync({
		server: {
			baseDir: 'scss'
		}
	});
})

gulp.task('watch', ['sass', 'browsersync'], function() {
	gulp.watch('dev/scss/**/*.scss', ['sass']),
	gulp.watch('views/*.handlebars', browsersync.reload),
	gulp.watch('views/layouts/*.handlebars', browsersync.reload),
	gulp.watch('*.js', browsersync.reload)
});

gulp.task( 'default', [ 'server', 'sass', 'browsersync', 'watch'] )


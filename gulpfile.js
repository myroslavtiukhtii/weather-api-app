const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();
const clear = require('gulp-clean');

function clean() {
    return src('./dist/*', {
        read: false,
    })
    .pipe(clear());
}


function styles() {
    return src('./src/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 12 versions'], cascade: false}))
    .pipe(cssnano())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write())
    .pipe(dest('./dist/css'))
    .pipe(browsersync.stream());
}


function scripts() {
    return src('./src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(rename('script.min.js'))
    .pipe(sourcemaps.write())
    .pipe(dest('./dist/js'))
    .pipe(browsersync.stream());
}

function images() {
    return src('./src/img/**/*.{png,jpg,svg}')
    .pipe(imagemin(
        [
            imagemin.mozjpeg({ progressive: true}),
            imagemin.optipng({ optimizationLevel: 3}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]
    ))
    .pipe(dest('./dist/img'))
    .pipe(browsersync.stream());
}

function html() {
    return src('./src/*.html')
    .pipe(dest('./dist/'))
    .pipe(browsersync.stream());
}

function fonts() {
    return src('./src/fonts/**/*')
    .pipe(dest('./dist/fonts'))
    .pipe(browsersync.stream());
}

function videos() {
    return src('./src/media/**/*')
    .pipe(dest('./dist/media'))
    .pipe(browsersync.stream());
}


function browserSync() {
    browsersync.init({
        server: {
            baseDir: './dist'
        },
        port: 3000
    });
}

function watchFiles() {
    watch('./src/sass/**/*', styles);
    watch('./src/*.html', html);
    watch('./src/img/**/*.{png,jpg,svg}', images);
    watch('./src/js/**/*', scripts);
}


exports.default = series(clean, parallel(html, styles, fonts, images, scripts, videos), parallel(watchFiles, browserSync));


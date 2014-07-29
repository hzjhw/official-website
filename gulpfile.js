var gulp = require('gulp');

var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var yuidoc = require("gulp-yuidoc");
var minifyCSS = require('gulp-minify-css');
var del = require('del');

var paths = {
    app :{
      scripts: {
        source: [
            'app/vendor/jquery/jquery.min.js'
        ],
          dist: 'app/scripts',
          name: 'app.min.js'
      }
    }
};

function doTask(item, debug){
    for (var key in paths[item]) {
        switch (key) {
            case 'scripts':
                try {
                    gulp.task(item + key, function () {
                        if (debug) {
                            return gulp.src(paths[item].scripts.source)
                              /*  .pipe(jshint())
                                .pipe(jshint.reporter(stylish))*/
                                .pipe(concat(paths[item].scripts.name))
                                .pipe(gulp.dest(paths[item].scripts.dist));
                        }
                        return gulp.src(paths[item].scripts.source)
                            .pipe(concat(paths[item].scripts.name))
                            .pipe(uglify())
                            .pipe(gulp.dest(paths[item].scripts.dist));
                    });
                    gulp.start(item + key);
                } catch (e) {
                    console.error(item + key + e);
                }
                break;

            case 'styles':
                try {
                    gulp.task(item + key, function () {
                        return gulp.src(paths[item].styles.source)
                            .pipe(minifyCSS({keepBreaks: true}))
                            .pipe(concat(paths[item].styles.name))
                            .pipe(gulp.dest(paths[item].styles.dist));
                    });
                    gulp.start(item + key);
                } catch (e) {
                    console.error(item + key + e);
                }
                break;

            case 'doc':
                try {
                    gulp.task(item + key, function () {
                        return gulp.src(paths[item].doc.source)
                            .pipe(yuidoc())
                            .pipe(gulp.dest(paths[item].doc.dist))
                    });
                    gulp.start(item + key);
                } catch (e) {
                    console.error(item + key + e);
                }
                break;

            case 'images':
                try {
                    gulp.task(item + key, function () {
                        return gulp.src(paths[item].images.source)
                            .pipe(imagemin({optimizationLevel: 5}))
                            .pipe(gulp.dest(paths[item].images.dist));
                    });
                    gulp.start(item + key);
                } catch (e) {
                    console.error(item + key + e);
                }
                break;
            default:
        }
    }
}

function startTask(debug) {
    for (var item in paths) {
        doTask(item, debug);
    }
}


// 使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: 'test',
        livereload: true
    });
});
gulp.task('html', function () {
    gulp.src('./test/*.html')
        .pipe(connect.reload());
});

gulp.task('clean', function(cb) {
    del(['doc'], cb);
});

// 创建watch任务去检测文件,当文件改动之后，去调用一个Gulp的Task
gulp.task('watch', function() {
    gulp.watch(paths, ['begin']);
});
gulp.task('EstTask', function(){
    doTask('Est', true);
});
gulp.task('Est.minTask', function(){
    doTask('Est', false);
});
gulp.task('Est', ['watch.Est', 'EstTask']);
gulp.task('Est.min',['watch.Est.min','Est.minTask']);
gulp.task('watch.Est', function(){
    gulp.watch(paths.Est.scripts.source, ['Est'])
});
gulp.task('watch.Est.min', function(){
    gulp.watch(paths.Est.scripts.source, ['Est.min']);
});

gulp.task('app', function(){
    doTask('app', true);
});
gulp.task('app.min', function(){
    doTask('app', false);
});
gulp.task('doc', function(){
    doTask('doc', false);
});
gulp.task('patch', function(){
    doTask('patch', true);
});
gulp.task('patch.min', function(){
    doTask('patch', false);
});
gulp.task('normal', function(){
    startTask(false);
});
gulp.task('debug', function(){
    startTask(true);
});
gulp.task('fileupload', function(){
    doTask('fileupload', true);
});
gulp.task('fileupload.min', function(){
    doTask('fileupload', false);
});
gulp.task('ueditor', function(){
    doTask('ueditor', true);
});
gulp.task('ueditor.min', function(){
    doTask('ueditor', false);
});
gulp.task('gallery', function(){
    doTask('gallery', true);
});
gulp.task('gallery.min', function(){
    doTask('gallery', false);
});

gulp.task('acecss', function(){
    doTask('acecss', true);
});
gulp.task('acecss.min', function(){
    doTask('acecss', false);
});


// 登录注册
gulp.task('Account', function(){
    doTask('Account', true);
});
gulp.task('Account.min', function(){
    doTask('Account', false);
});

gulp.task('default', [ 'normal']);
gulp.task('watch.min', function(){
    gulp.watch(paths.fileupload.scripts.source, ['fileupload.min']);
    gulp.watch(paths.ueditor.scripts.source, ['ueditor.min']);
    gulp.watch(paths.gallery.scripts.source, ['gallery.min']);
    gulp.watch(paths.acecss.styles.source, ['acecss.min']);
});
gulp.task('watch', function(){
    gulp.watch(paths.fileupload.scripts.source, ['fileupload']);
    gulp.watch(paths.ueditor.scripts.source, ['ueditor']);
    gulp.watch(paths.gallery.scripts.source, ['gallery']);
    gulp.watch(paths.acecss.styles.source, ['acecss']);
});

gulp.task('css', ['acecss']);
gulp.task('css.min', ['acecss.min']);

gulp.task('js', ['fileupload', 'ueditor', 'gallery']);
gulp.task('js.min', ['fileupload.min', 'ueditor.min', 'gallery.min']);

gulp.task('all', ['watch', 'js', 'css']);
gulp.task('all.min', ['watch.min', 'js.min', 'css.min']);
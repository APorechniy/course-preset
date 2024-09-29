import { task, src, dest, watch, series } from "gulp";
import concat from 'gulp-concat';
import server from 'gulp-webserver';
import repath from 'gulp-repath'

const PORT = 3000

const repathConf = {
    verMode: 'hash',
    hashName: '{origin}-{hash}',
    baseMap: {'src': './dist'},
    element: ['script', 'style', 'image'],
    excludeFile: [],
    replace: {
      '@cdn/': `//localhost:${PORT}/`
    }
};

task("html", function() {
    return src("./src/*.html")
    .pipe(dest("dist"));
});

task("css", function() {
    return src("src/css/*.css")
        .pipe(concat('style.css'))
        .pipe(dest("dist/css"));
});

task('finale-scripts', function() {
    return src('dist/js/*.js')
      .pipe(repath(repathConf))
      .pipe(dest('dist/js'));
  });

task('finale-css', function() {
    return src('dist/css/*.css')
      .pipe(repath(repathConf))
      .pipe(dest('dist/css'));
  });
  
task('finale-html', function() {
return src('./*.html')
    .pipe(repath(repathConf))
    .pipe(dest('./'));
});

task("scripts", function() {
    return src("src/js/*.js")
        .pipe(dest("dist/js"));
});

task('imgs', function() {
    return src("src/images/*.+(jpg|jpeg|png|gif)")
        .pipe(dest("dist/images"))
});

task('build', async function() {
    const tasks = series("html", "css", "scripts", "finale-css", "finale-scripts", "finale-html")
    await tasks()
})

task("watch", function() {
    const htmlWatcher = series("html")
    const jsWatcher = series("scripts")
    const cssWatcher = series("css")
    const imagesWatcher = series("imgs")

    watch("src/*.html", htmlWatcher);
    watch("src/js/*.js", jsWatcher);
    watch("src/css/*.css", cssWatcher);
    watch("src/images/*.+(jpg|jpeg|png|gif)", imagesWatcher);
});

task("server", function() {
    src('dist')
        .pipe(server({
            livereload: true,
            open: true,
            port: PORT
        }));

    series("watch")()
})
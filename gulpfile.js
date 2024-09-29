import { task, src, dest, watch, series } from "gulp";
import concat from 'gulp-concat';
import server from 'gulp-webserver';

const PORT = 3000

task("html", function() {
    return src("./src/*.html")
    .pipe(dest("dist"));
});

task("css", function() {
    return src("src/css/*.css")
        .pipe(concat('style.css'))
        .pipe(dest("dist/css"));
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
    const tasks = series("html", "css", "scripts")
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
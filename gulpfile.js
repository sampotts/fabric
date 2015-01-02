// ==========================================================================
// Gulp build script
// ==========================================================================

var fs = require("fs"),
	path = require("path"),
	gulp = require("gulp"),
	gutil = require("gulp-util"),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	less = require("gulp-less"),
	minifyCss = require("gulp-minify-css"),
	runSequence = require("run-sequence"),
	prefix = require("gulp-autoprefixer");

var projectPath = __dirname;
var paths = {
    project: 	projectPath,

    // Watch paths
    watchless: 	path.join(projectPath, "assets/less/**/*"),
    watchjs: 	path.join(projectPath, "assets/js/**/*"),

    // Output paths
    js:  		path.join(projectPath, "dist/js/"),
    css:  		path.join(projectPath, "dist/css/"),
},
// Task names
taskNames = {    
    lessBuild: 	"less-",
    jsBuild: 	"js-"
},
// Task arrays
lessBuildTasks 	= [],
jsBuildTasks 	= [],

// Fetch bundles from JSON
lessBundles 	= load(path.join(paths.project, "bundles_less.json")),
jsBundles 		= load(path.join(paths.project, "bundles_js.json"));

// Load json and add project path to every file in every bundle
function load(bundlePath){
    var json = JSON.parse(fs.readFileSync(bundlePath));
	var result = {};
	
    // Append project directory to asset path
	for (var key in json) {
		var files = [];
		
		json[key].forEach(function (asset) {
            files.push(path.join(paths.project, asset));
		});

		result[key] = files;
	}
	return result;
}

// Process JS 
for (var key in jsBundles) {
	(function(key) {
	    var taskName = taskNames.jsBuild + key;
	    jsBuildTasks.push(taskName);

	    gulp.task(taskName, function () {
	        return gulp.src(jsBundles[key])
				.pipe(concat(key))
	            .pipe(uglify())
	            .pipe(gulp.dest(paths.js));
	    });
	})(key);
}

// Process CSS
for (var key in lessBundles) {
    (function (key) {		
	    var taskName = taskNames.lessBuild + key;
	    lessBuildTasks.push(taskName);

	    gulp.task(taskName, function () {
			return gulp.src(lessBundles[key])
				.pipe(less())
				.on("error", gutil.log)
				.pipe(concat(key))
				.pipe(prefix(["last 2 versions", "> 1%", "ie 9"], { cascade: true }))
				.pipe(minifyCss())
				.pipe(gulp.dest(paths.css));
		});
	})(key);
}

/*
default: 
    - less -> min css
    - js -> min js
    - output files
    run "gulp"
*/
gulp.task("default", function(){
	runSequence(jsBuildTasks.concat(lessBuildTasks, "watch"));
});

// Watch for file changes
gulp.task("watch", function () {
    gulp.watch(paths.watchless, lessBuildTasks);
    gulp.watch(paths.watchjs, jsBuildTasks);
});
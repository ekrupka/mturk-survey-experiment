module.exports = function(grunt) {
	var SRC_CSS = 'css/src/',
			SRC_CSS_VENDOR = SRC_CSS + 'vendor/'
			SRC_JS = 'js/src/',
			SRC_JS_VENDOR = SRC_JS + 'vendor/',
			BUILD_CSS = 'css/bin/',
			BUILD_JS = 'js/bin/';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
		},
		clean: {
		},
		less: {
			css: {
				src: [SRC_CSS + 'mturk.less'],  
        dest: SRC_CSS + 'out.css'
			}
			/*files: {
				SRC_CSS_BUILD: SRC_CSS_LESS
			}	*/
		},
		watch: {
			less: {
				files: [SRC_CSS + '*.less'],
				tasks: ['concat:less', 'less', 'concat:css']
			},
			js: {
				files: [SRC_JS + '*.js', SRC_JS_VENDOR + '*.js'],
				tasks: ['concat:js', 'concat:jsv2']
			}
		},
		concat: {
			css: {
				src: [SRC_CSS_VENDOR + '*.css', SRC_CSS + "*.css"],
        dest: BUILD_CSS + 'style.css'
			},
	  	less: {
		    options: {
		    },
		    src: [SRC_CSS + '*.less'],
		    dest: BUILD_CSS + 'main.less'
		  },
		  js: {
		  	options: {
		  	},
		  	src: [SRC_JS_VENDOR + 'nouislider.js', SRC_JS + '*.js', ],
		  	dest: BUILD_JS + 'mturk.js'
		  },
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', 'watch');
	grunt.registerTask('default', 'watching');
};
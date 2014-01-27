module.exports = function(grunt) {
	var SRC_CSS = 'css/src/',
			SRC_CSS_VENDOR = SRC_CSS + 'vendor/'
			SRC_V1_JS = 'v1/js/src/',
			SRC_V1_JS_VENDOR = SRC_V1_JS + 'vendor/',
			SRC_V2_JS = 'v2/js/src/',
			SRC_V2_JS_VENDOR = SRC_V2_JS + 'vendor/',
			BUILD_CSS = 'css/bin/',
			BUILD_V1_JS = 'v1/js/bin/',
			BUILD_V2_JS = 'v2/js/bin/';

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
				files: [SRC_V1_JS + '*.js', SRC_V1_JS_VENDOR + '*.js', SRC_V2_JS + '*.js', SRC_V2_JS_VENDOR + '*.js'],
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
		  	src: [SRC_V1_JS_VENDOR + 'nouislider.js', SRC_V1_JS + '*.js', ],
		  	dest: BUILD_V1_JS + 'mturk.js'
		  },
		  jsv2: {
		  	options: {
		  	},
		  	src: [SRC_V2_JS_VENDOR + 'nouislider.js', SRC_V2_JS + '*.js', ],
		  	dest: BUILD_V2_JS + 'mturk.js'
		  }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', 'watch');
	grunt.registerTask('default', 'watching');
};
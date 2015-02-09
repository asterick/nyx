var es6ify = require("es6ify");

module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            dev: {
                require: [ es6ify.runtime ],
                files: {
                    'build/nyx.js': ['lib/index.js']
                },
                options: {
                    transform: [
                        [ require("browserify-pegjs"), { cache: true } ],
                        es6ify
                    ],
                    browserifyOptions: { debug: true },
                    watch: true
                }
            }
        },

        uglify: {
            my_target: {
                files: {
                    'build/nyx.min.js': 'build/nyx.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask("publish", ["browserify", "uglify"]);
    grunt.registerTask("default", ["publish"]);
};

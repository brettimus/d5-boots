module.exports = function(grunt){
    "use strict";
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files: ['dist/d5.js'],
                tasks: ['uglify']
            }
        },

        browserify: {
            'dist/d5.js': ['src/js/d5.js']
        },

        uglify: {
            build: {
                files: {
                    'dist/d5.min.js': ['dist/d5.js']
                }
            }
        },
    });

    grunt.registerTask('default', ['browserify', 'uglify']);
};
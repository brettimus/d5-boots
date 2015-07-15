module.exports = function(grunt) {
    "use strict";

    // load all grunt npm modules
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files: ['src/js/charts-base/*.js'],
                tasks: ['default']
            }
        },

        // lets us use npm-style modules in the browser
        browserify: {
            'dist/d5.js': ['src/js/d5.js']
        },

        // for minification and compression
        uglify: {
            build: {
                files: {
                    'dist/d5.min.js': ['dist/d5.js']
                }
            }
        },
    });

    // default task
    // * this is what runs when we just type `grunt`
    grunt.registerTask('default', ['browserify']);
    grunt.registerTask('dist', ['browserify', 'uglify']);

};

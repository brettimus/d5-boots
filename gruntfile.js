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

        concat: {
          options: {
            separator: '\n',
            stripBanners: true,
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
          },
          dist: {
            src: ['src/js/d5-base.js', 'src/js/d5-hist.js'], // concats in order
            dest: 'dist/d5.js',
          },
        },

        uglify: {
            build: {
                files: {
                    'dist/d5.min.js': ['dist/d5.js']
                }
            }
        },
    });

    grunt.registerTask('default', ['concat', 'uglify']);
};
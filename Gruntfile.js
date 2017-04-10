/* global module:false */
module.exports = function(grunt) {
  'use strict';

  // load all grunt tasks
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // Project configuration
  grunt.initConfig({
    connect: {
      test: {
        options: {
          port: 8000,
          base: {
            path: '.',
            options: {
              index: 'test/runner.html'
            }
          },
          livereload: true,
          open: true
        }
      },

      www: {
        options: {
          port: 8000,
          base: 'www',
          livereload: false,
          open: true
        }
      }
    },

    watch: {
      js: {
        files: [ 'www/src/**/*.js', 'test/tests/**/*.js' ]
      },
      css: {
        files: [ 'www/css/**/*.css', 'test/css/**/*.css' ]
      },
      html: {
        files: [ 'www/*.html', 'test/*.html' ]
      },
      markdown: {
        files: [ '*.md' ]
      },
      options: {
        livereload: true
      }
    },

    jshint : {
      options : {
        jshintrc : '.jshintrc'
      },
      all : [
        'www/src/**/*.js',
        '!www/src/lib/**/*.js'
      ]
    }
  });

  // Default task
  grunt.registerTask('default', [ 'serve' ]);

  // Serve presentation locally
  grunt.registerTask('serve', [ 'connect:www', 'watch' ]);

  // Check potential errors and idioms
  grunt.registerTask('check', [ 'jshint' ]);

  // Open the tests and chek idioms
  grunt.registerTask('test', [ 'connect:test', 'watch' ]);
};

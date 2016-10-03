/* global module:false */
module.exports = function(grunt) {
  'use strict';

  // load all grunt tasks
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // configurable vars
  var port = grunt.option('port') || 8000;
  var base = grunt.option('base') || 'www';

  // Project configuration
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: port,
          base: base,
          livereload: true,
          open: true
        }
      }
    },

    watch: {
      js: {
        files: [ 'www/src/**/*.js' ]
      },
      css: {
        files: [ 'www/css/**/*.css' ]
      },
      html: {
        files: [ 'www/*.html']
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
  grunt.registerTask( 'default', [ 'serve' ] );

  // Serve presentation locally
  grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

  // Check potential errors and idioms
  grunt.registerTask('check', [ 'jshint' ]);
};

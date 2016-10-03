/* globals requirejs */

// RequireJS configuration
requirejs.config({

  // Path shortcuts for common used components
  paths: {

    // Utils
    'jquery' : 'lib/jquery/jquery',
    'debug'  : 'lib/utils/debug'
  }
});

// Load main application file
requirejs(['jquery'], function( $ ) {
  'use strict';

  $(document).ready(function() {
    console.log('dom loaded');
  });
});

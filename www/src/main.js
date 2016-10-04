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
requirejs(['jquery', 'UnfoldingsAndHulls'], function ( $, app ) {
  'use strict';

  $(document).ready(function () {
    app.start();
  });
});

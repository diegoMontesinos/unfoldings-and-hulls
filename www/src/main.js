/* globals requirejs */

// RequireJS configuration
requirejs.config({

  // Path shortcuts for common used components
  paths: {

    // Utils
    'jquery'     : 'lib/jquery/jquery',
    'debug'      : 'lib/utils/debug',

    // Three
    'three'      : 'lib/three/three',
    'tbControls' : 'lib/three/controls/TrackballControls'
  },

  // Load configuration options for non-module libraries
  shim: {
    'tbControls' : { deps: [ 'three' ], exports: 'TrackballControls' }
  }
});

// Load main application file
requirejs(['jquery', 'UnfoldingsAndHulls'], function ( $, app ) {
  'use strict';

  $(document).ready(function () {
    app.start();
  });
});

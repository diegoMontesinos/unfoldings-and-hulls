/* globals requirejs */

// Configuracion para RequireJS
requirejs.config({
  baseUrl: '../src',

  // Rutas para los componentes mas usados
  paths: {

    // Utils
    'debug'      : 'lib/utils/debug',
    'jquery'     : 'lib/utils/jquery',
    'underscore' : 'lib/utils/underscore',

    // Three
    'three'           : 'lib/three/three',
    'TBControls'      : 'lib/three/controls/TrackballControls',
    'OrthoTBControls' : 'lib/three/controls/OrthographicTrackballControls'
  },

  // Configuracion para las bibliotecas no modulares
  shim: {
    'TBControls'      : { deps: [ 'three' ], exports: 'TrackballControls' },
    'OrthoTBControls' : { deps: [ 'three' ], exports: 'OrthographicTrackballControls' }
  }
});

// Carga la aplicacion principal
requirejs(['UnfoldingsAndHulls'], function (app) {
  'use strict';

  app.start();
});

/* globals requirejs */

// Configuracion para RequireJS
requirejs.config({
  baseUrl: '../src',

  // Rutas para los componentes mas usados
  paths: {

    // Utils
    'debug'      : 'lib/utils/debug',
    'underscore' : 'lib/utils/underscore',

    // Three
    'three'      : 'lib/three/three',
    'tbControls' : 'lib/three/controls/TrackballControls'
  },

  // Configuracion para las bibliotecas no modulares
  shim: {
    'tbControls' : { deps: [ 'three' ], exports: 'TrackballControls' }
  }
});

// Carga la aplicacion principal
requirejs(['UnfoldingsAndHulls'], function (app) {
  'use strict';

  app.start();
});

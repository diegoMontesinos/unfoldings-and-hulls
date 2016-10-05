/* globals requirejs */

// Configuracion para RequireJS
requirejs.config({

  // Rutas para los componentes mas usados
  paths: {

    // Utils
    'jquery'     : 'lib/jquery/jquery',
    'debug'      : 'lib/utils/debug',

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
requirejs(['jquery', 'UnfoldingsAndHulls'], function ( $, app ) {
  'use strict';

  $(document).ready(function () {
    app.start();
  });
});

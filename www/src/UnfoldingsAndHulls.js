/**
 * Este modulo exporta un objeto singleton de la aplicacion.
 * Es el punto de entrada para toda la logica.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Debug ID
  var debug = require('debug')('app');

  // Dependencias
  var Scene = require('./scene/Scene');

  // Definicion de la aplicacion
  var UnfoldingsAndHulls = function () {
    debug('Setup app');

    this.debugMode = true;
    this.scene     = new Scene(this);
  };

  UnfoldingsAndHulls.prototype = {
    start : function () {
      debug('Starting app');

      this.scene.start();
    }
  };

  if (!exports) {
    exports = {};
  }

  // Regresa una instancia de la aplicacion como el resultado del modulo
  var app = new UnfoldingsAndHulls();
  module.exports = app;
});

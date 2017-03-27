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
  var View2D = require('views/View2D');

  var Utils  = require('misc/Utils');
  var Vector = require('math/Vector');

  // Definicion de la aplicacion
  var UnfoldingsAndHulls = function () {
    debug('Setup app');

    this.debugMode = true;

    this.view2D = new View2D();
  };

  UnfoldingsAndHulls.prototype = {
    start : function () {
      debug('Starting app');

      var points = Utils.randomPointsInCircle({
        num    : 5,
        center : new Vector(250, 250),
        radius : 100
      });

      for (var i = 0; i < points.length; i++) {
        this.view2D.addPoint(points[i]);
      }
    }
  };

  if (!exports) {
    exports = {};
  }

  // Regresa una instancia de la aplicacion como el resultado del modulo
  var app = new UnfoldingsAndHulls();
  module.exports = app;
});

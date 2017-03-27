/**
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Debug ID
  var debug = require('debug')('app:view-2D');

  // Definicion del modulo
  var View2D = function () {
    debug('Setup view 2D');

    this.view = document.getElementById('viewport-2D');
  };

  View2D.prototype.addPoint = function (vector) {
    var svgns = 'http://www.w3.org/2000/svg';

    var point = document.createElementNS(svgns, 'circle');
    point.setAttributeNS(null, 'cx', vector.x);
    point.setAttributeNS(null, 'cy', vector.y);
    point.setAttributeNS(null, 'r',  2.5);
    point.setAttributeNS(null, 'fill', 'black');

    this.view.appendChild(point);

    return point;
  };

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = View2D;
});

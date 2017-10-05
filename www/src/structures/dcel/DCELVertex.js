/**
 * Representa un vertice de una Double-connected Edge List (DCEL),
 * Extiende la funcionalidad de un Vector3.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Dependencias
  var Vector3 = require('math/Vector3');

  // Definicion del modulo
  var DCELVertex = function ( x, y, z ) {
    Vector3.call(this, x, y, z);

    this.incidentEdge = null;
  };

  DCELVertex.prototype = Object.create(Vector3.prototype);
  DCELVertex.prototype.constructor = DCELVertex;

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = DCELVertex;
});

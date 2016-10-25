/**
 * Media arista de una DCEL.
 *
 * Esta representa una parte, o un sentido de una arista
 * en una malla tridimensional.
 *
 * vi -----> vj
 *
 * Se guarda un registro de su arista gemela, es decir,
 * la que la complementa en sentido.
 *
 * Gemela:
 * vj -----> vi
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Definicion del modulo
  var DCELHalfEdge = function ( origin, end ) {

    this.origin = origin;
    this.end    = end;

    this.twin = null;
    this.prev = null;
    this.next = null;

    this.incidentFace = null;
  };

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = DCELHalfEdge;
});

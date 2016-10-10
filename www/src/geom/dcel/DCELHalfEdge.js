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
  var DCELHalfEdge = function ( iOrigin, iEnd ) {
    this.iOrigin = iOrigin;
    this.iEnd    = iEnd;

    this.twin = null;
    this.prev = null;
    this.next = null;

    this.incidentFace = null;
  };

  DCELHalfEdge.prototype = {
    equals : function ( he ) {
      return this.origin.equals(he.origin) && this.end.equals(he.end);
    }
  };

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = DCELHalfEdge;
});

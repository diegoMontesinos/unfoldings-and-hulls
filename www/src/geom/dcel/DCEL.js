/**
 * Implementación de la estructura de datos Doubly-connected Edge List (DCEL)
 * para representar una malla de tres dimensiones.
 *
 * Con fines de tener una forma de incluir la DCEL en la escena, este modulo
 * extiende al modulo THREE.Geometry.
 *
 * Se mantienen tres registros: Caras, Aristas y Vertices.
 * Dado que una arista es adyacente a dos caras, una arista se guarda en dos
 * registros llamados half-edge.
 *
 * Usaremos instancias de este modulo para representar los poliedros de este
 * proyecto.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Dependencias
  var THREE = require('three');
  var Utils = require('misc/Utils');

  // Definicion del modulo
  var DCEL = function () {
    THREE.Geometry.call(this);

    this.halfEdges = [];
  };

  DCEL.prototype = Object.create(THREE.Geometry.prototype);
  DCEL.prototype.constructor = DCEL;

  DCEL.prototype.addVertex = function ( vertex ) {
    this.vertices.push(vertex);
    vertex.index = this.vertices.length - 1;

    return vertex;
  };

  // TODO: Hacer O(log n) esta busqueda
  DCEL.prototype.getVertexIndexByCoords = function ( coords ) {
    for (var i = 0, len = this.vertices.length; i < len; i++) {
      var v = this.vertices[i];
      if (v.equals(coords)) {
        return i;
      }
    }

    return -1;
  };

  // TODO: Hacer O(log n) esta busqueda
  DCEL.prototype.getVertexByCoords = function ( coords ) {
    for (var i = 0, len = this.vertices.length; i < len; i++) {
      var v = this.vertices[i];
      if (v.equals(coords)) {
        return v;
      }
    }
  };

  DCEL.prototype.addHalfEdge = function ( halfEdge ) {
    this.halfEdges.push(halfEdge);

    return halfEdge;
  };

  DCEL.prototype.addFace = function ( face ) {
    this.faces.push(face);

    return face;
  };

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = DCEL;
});

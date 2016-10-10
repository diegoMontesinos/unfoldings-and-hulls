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
    var vertices = this.vertices;
    var len = vertices.length;

    if (len > 0) {
      var index = Utils.binarySearchVertex(0, len - 1, vertices, vertex);

      if (!vertices[index] || !vertices[index].equals(vertex)) {
        vertices.splice(index, 0, vertex);
        return vertex;
      }
    } else {
      vertices.push(vertex);
      return vertex;
    }
  };

  DCEL.prototype.getVertexIndexByCoords = function ( coords ) {
    var vertices = this.vertices;
    var len = vertices.length;

    var index  = Utils.binarySearchVertex(0, len - 1, vertices, coords);
    return index;
  };

  DCEL.prototype.addHalfEdge = function ( halfEdge ) {
    this.halfEdges.push(halfEdge);
  };

  DCEL.prototype.addFace = function ( face ) {
    this.faces.push(face);
  };

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = DCEL;
});

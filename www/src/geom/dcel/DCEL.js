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

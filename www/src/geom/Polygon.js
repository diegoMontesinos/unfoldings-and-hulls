/**
 * Representa un polígono finitio de n-vértices manteniendo una lista de vértices
 * en un arreglo.
 *
 * Las aristas del polígono están dadas implícitamente mediante el orden en el
 * que están guardados los vértices en el arreglo. Es decir, las aristas del polígono
 * son: e_{0} = v_{0}v_{1}, e_{1} = v_{1}v_{2}, ..., e_{n-1} = v_{n-1}v_{0}.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  var Vector = require('math/Vector');

  var Polygon = function (vertices) {
    this.vertices = vertices || [];
  };

  /**
   * Agrega un vértice al polígono.
   *
   * @param  {Object} vertex  El vértice a agregar.
   */
  Polygon.prototype.addVertex = function (vertex) {
    this.vertices.push(vertex);
  };

  /**
   * Evalua si un punto está contenido (dentro) del polígono o no.
   * SOLO FUNCIONA SI ES UN POLÍGONO CONVEXO.
   *
   * @param  {Object} point  El punto a evaluar.
   * @return {Boolean}       Si el punto está contenido en el polígono.
   */
  Polygon.prototype.contains = function (point) {
    var vertices = this.vertices;

    var current, next;
    for (var i = 0; i < vertices.length; i++) {
      current = vertices[i];
      next    = vertices[(i + 1) % vertices.length];

      if (Vector.areaSign(current, next, point) > 0) {
        return false;
      }
    }

    return true;
  };

  if (!exports) {
    exports = {};
  }

  module.exports = Polygon;
});

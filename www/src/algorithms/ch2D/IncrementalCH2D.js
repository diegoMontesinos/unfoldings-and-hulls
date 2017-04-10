/**
 * Implementación del algoritmo "Incremental" para calcular el cierre convexo de
 * una conjunto finito de puntos en el plano.
 *
 * El cierre convexo de un conjunto finito de puntos S es la mínima región convexa
 * que contiene a S.
 *
 * Las funciones de este módulo representan los pasos importantes del algoritmo,
 * y están pensadas para que se puedan ocupar de forma independiente. O también
 * existe la función "run", para calcular el cierre convexo en una sola llamada.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  var Vector  = require('math/Vector');
  var Polygon = require('geom/Polygon');

  var IncrementalCH2D = {

    /**
     * Ejecuta el algoritmo "incremental" para calcular el cierre convexo.
     *
     * Esta implementación ocupa un polígono para representar al cierre convexo,
     * manteniendo a los vértices en una lista.
     *
     * @param  {Array} input  El conjunto de puntos de entrada.
     * @return {Object}       El cierre convexo calculado, como un polígono.
     */
    run: function (input) {
      if (input.length < 3) {
        return undefined;
      }

      var hull = this.makeFirstHull(input);

      for (var i = 3; i < input.length; i++) {
        var point = input[i];
        if (!hull.contains(point)) {
          this.appendPoint(hull, point);
        }
      }

      return hull;
    },

    /**
     * Primer paso del algoritmo incremental.
     * Genera el cierre convexo de los primeros tres puntos del conjunto de entrada,
     * es decir, un triángulo: H_{3}.
     *
     * @param  {Array} input  El conjunto de puntos de entrada.
     * @return {Object}       El primer polígono para el algoritmo.
     */
    makeFirstHull: function (input) {
      var a = input[0],
          b = input[1],
          c = input[2];

      var vertices;
      if (Vector.areaSign(a, b, c) < 0) {
        vertices = [a, b, c];
      } else {
        vertices = [a, c, b];
      }

      return new Polygon(vertices);
    },

    /**
     * Paso iterativo del algoritmo incremental.
     * Toma un cierre convexo previamente calculado H_{i} y un punto P fuera de
     * él, y devuelve el cierre convexo de su unión.
     *
     * Para calcular el cierre convexo de la unión se necesitan encontrar dos
     * vértices v_{i}, v_{j} tales que las líneas dirigidas de p a estos vértices,
     * deja a H_{i} completamente de un lado (la línea Pv_{i} lo deja del lado
     * izquierdo, y la línea Pv_{j} lo deja del lado derecho).
     * A dichos vértices se les conoce como vértices de soporte, y a las líneas
     * creadas: líneas tangentes.
     *
     * La unión entonces es formando un nuevo polígono incluyendo al nuevo punto
     * con los vértices de soporte y eliminando a los vértices innecesarios.
     *
     * @param  {Object} hull   El cierre convexo creado en un paso de la iteración.
     * @param  {Object} point  El punto a agregar.
     */
    appendPoint: function (hull, point) {
      var indexLeft  = this.indexOfSupportVertex(hull, point, true);
      var indexRight = this.indexOfSupportVertex(hull, point, false);

      if (indexLeft < indexRight) {
        var countToRemove = (indexRight - indexLeft) - 1;
        hull.vertices.splice(indexLeft + 1, countToRemove, point);
      } else {
        hull.vertices.splice(indexLeft + 1);
        hull.vertices.splice(0, indexRight);
        hull.vertices.push(point);
      }
    },

    /**
     * Encuentra los índices de un vértice de soporte para un polígono convexo
     * con un punto.
     *
     * Un vértice de soporte es aquel que la línea dirigida de un punto P al
     * vértice deja a todo el polígono convexo de un lado del semiplano creado
     * por la línea. A estas lineas se les conoce como tangentes.
     *
     * Existen dos vértices de soporte: uno que hace que el polígono quede en el
     * semiplano izquierdo y otro que hace que quede en el lado derecho.
     *
     * @param  {Object} hull            Polígono convexo.
     * @param  {Object} point           Punto con el que se hacen las líneas tangentes.
     * @param  {Boolean} ofLeftTangent  Si se encuentra el vértice izquierdo o derecho.
     * @return {Number}                 El ínice del vértice dentro del polígono.
     */
    indexOfSupportVertex: function (hull, point, ofLeftTangent) {
      var vertices = hull.vertices;
      var size     = vertices.length;

      var current, last, next;

      var turnToLast, turnToNext;
      var sameTurn;

      var isSupportVertex;

      for (var i = 1; i <= size; i++) {
        last    = vertices[i - 1];
        current = vertices[i % size];
        next    = vertices[(i + 1) % size];

        turnToLast = Vector.areaSign(point, current, last);
        turnToNext = Vector.areaSign(point, current, next);

        sameTurn = (turnToLast * turnToNext) > 0;
        if (!sameTurn) {
          continue;
        }

        isSupportVertex = ((turnToNext < 0) && !ofLeftTangent) || ((turnToNext > 0) && ofLeftTangent);
        if (isSupportVertex) {
          return (i % size);
        }
      }

      return -1;
    }
  };

  if (!exports) {
    exports = {};
  }

  module.exports = IncrementalCH2D;
});

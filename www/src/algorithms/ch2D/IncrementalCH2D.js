/**
 * Implementación del algoritmo "Incremental" para calcular el cierre convexo de
 * un conjunto finito de puntos en el plano (S).
 *
 * La idea de este algoritmo es que el cierre convexo se vaya calculando iterativamente,
 * es decir, en cada iteración se tiene una solución parcial para un subconjunto
 * de S y se incrementa la solución añadiendo un punto. De ahí el nombre.
 *
 * Primero comienza con un triángulo formado por los primeros tres puntos de S,
 * al que llamamos H_{3}. Y luego para el resto de puntos, en cada iteración
 * se tiene la solución calculada H_{i} y se calcula la unión con el punto.
 *
 * El algoritmo tiene una complejidad de O(n^2).
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  var _            = require('underscore');
  var ConvexHull2D = require('algorithms/ch2D/ConvexHull2D');

  var IncrementalCH2D = {

    /**
     * Ejecuta el algoritmo "incremental" para calcular el cierre convexo.
     *
     * @param  {Array} input  El conjunto de puntos de entrada.
     * @return {Object}       El cierre convexo calculado, como un polígono.
     */
    run: function (input) {
      if (!this.validateInput(input)) {
        return undefined;
      }

      var hull = this.makeTriangle(input);

      for (var i = 3; i < input.length; i++) {
        var point = input[i];
        if (!hull.contains(point)) {
          this.appendPoint(hull, point);
        }
      }

      return hull;
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
      var checkLeftTangent  = function (turnToLast, turnToNext) { return turnToNext < 0; };
      var checkRightTangent = function (turnToLast, turnToNext) { return turnToNext > 0; };

      var indexLeft  = this.indexOfSupportVertex(hull, point, checkLeftTangent);
      var indexRight = this.indexOfSupportVertex(hull, point, checkRightTangent);

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
     * @param  {Object}   hull       Polígono convexo.
     * @param  {Object}   point      Punto con el que se hacen las líneas tangentes.
     * @param  {Function} checkSide  Función que verifica si esta del lado que deseamos.
     * @return {Number}              El ínice del vértice dentro del polígono.
     */
    indexOfSupportVertex: function (hull, point, checkSide) {
      for (var i = 0; i < hull.vertices.length; i++) {
        if (this.isTangentLine(point, i, hull, checkSide)) {
          return i;
        }
      }

      return -1;
    }
  };
  _.extend(IncrementalCH2D, ConvexHull2D);

  if (!exports) {
    exports = {};
  }

  module.exports = IncrementalCH2D;
});

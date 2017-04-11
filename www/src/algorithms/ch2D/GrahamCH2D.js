/**
 * Implementación del algoritmo "Escaneo de Graham", para calcular el cierre convexo
 * de una conjunto finito de puntos en el plano (S).
 *
 * La idea de este algoritmo, publica en 1972 por Ronald Graham, es crear un
 * polígono no convexo P, con todos los puntos de S, y luego "corregir" las aristas
 * que no son convexas para obtener entonces el borde del cierre convexo de S.
 *
 * Para construir a P, se toma como primer vértice el punto más bajo (mínimo en
 * su coordenada Y) al que llamamos pivote. Después se ordenan los puntos por la
 * pendiente que crean con el pivote, y se toman como el resto de los vértices
 * de P.
 *
 * Después, se recorre el borde de P, tomando tripletas y quitando los vértices
 * de P que rompen su convexidad. Al finalizar P es el borde del cierre convexo
 * de S.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  var _            = require('underscore');
  var Vector       = require('math/Vector');
  var Polygon      = require('geom/Polygon');
  var ConvexHull2D = require('algorithms/ch2D/ConvexHull2D');

  var GrahamCH2D = {

    /**
     * Ejecuta el algoritmo "escaneo de graham" para calcular el cierre convexo.
     *
     * @param  {Array} input  El conjunto de puntos de entrada.
     * @return {Object}       El cierre convexo calculado, como un polígono.
     */
    run: function (input) {
      if (!this.validateInput(input)) {
        return undefined;
      }

      var indexOfMinPointByY = this.indexOfMinPointByY(input);
      var sortedPoints = this.sortPointsBySlope(indexOfMinPointByY, input);
      var hullVertices = this.fixNonConvexTripletes(sortedPoints);

      return new Polygon(hullVertices);
    },

    /**
     * Obtiene el índice del punto más bajo (mínimo por Y) de un conjunto de
     * puntos, dado como arreglo.
     *
     * @param  {Array} points  El arreglo de puntos.
     * @return {Number}        El índice del arreglo de puntos.
     */
    indexOfMinPointByY: function (points) {
      var min, indexOfMin;

      for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (!min || (point.y < min.y)) {
          min = point;
          indexOfMin = i;
        }
      }

      return indexOfMin;
    },

    /**
     * Ordena un conjunto de puntos por la pendiente que hacen con el punto más
     * bajo. Regresa un arreglo donde el primer elemento es el punto más bajo
     * y el resto, los otros puntos odenados.
     *
     * @param  {Number} indexOfMinPointByY  El índice del punto mas bajo dentro del arreglo.
     * @param  {Array} input                El conjunto de entrada.
     * @return {Array}                      El conjunto ordenado por pendiente.
     */
    sortPointsBySlope: function (indexOfMinPointByY, input) {
      var minByY = input[indexOfMinPointByY];

      // Quita al minimo del conjunto de puntos
      var sortedPoints = input.slice(0, indexOfMinPointByY);
      sortedPoints = sortedPoints.concat(input.slice(indexOfMinPointByY + 1));

      sortedPoints.sort(this.grahamComparator(minByY));

      // Agrega al minimo al inicio
      sortedPoints.splice(0, 0, minByY);

      return sortedPoints;
    },

    /**
     * Obtiene la función comparadora de pendiente para un pivote.
     *
     * @param  {Object} pivot  El punto pivote.
     * @return {Function}      El comparador por pendiente.
     */
    grahamComparator: function (pivot) {
      return function (pointA, pointB) {
        return Vector.areaSign(pivot, pointA, pointB);
      };
    },

    /**
     * Corrige las tripletas que no son convexas, del polígono no convexo creado
     * a partir del conjunto ordenado por tangente de puntos.
     *
     * Al final el conjunto obtenido serán los vértices del borde del cierre convexo.
     *
     * @param  {Array} sortedPointsBySlope  Los puntos ordenados por pendiente.
     * @return {Array}                      Los puntos que forman una secuencia convexa.
     */
    fixNonConvexTripletes: function (sortedPointsBySlope) {
      var stack = [
        sortedPointsBySlope[0],
        sortedPointsBySlope[1]
      ];

      var previous, current;
      var next;
      var turn;

      for (var i = 2; i < sortedPointsBySlope.length; i++) {
        next = sortedPointsBySlope[i];

        var isConvexSequence = false;
        while (!isConvexSequence) {
          previous = stack[stack.length - 2];
          current  = stack[stack.length - 1];

          turn = Vector.areaSign(previous, current, next);
          isConvexSequence = (turn <= 0);

          if (!isConvexSequence) {
            stack.pop();
          }
        }

        stack.push(next);
      }

      return stack;
    }
  };
  _.extend(GrahamCH2D, ConvexHull2D);

  if (!exports) {
    exports = {};
  }

  module.exports = GrahamCH2D;
});

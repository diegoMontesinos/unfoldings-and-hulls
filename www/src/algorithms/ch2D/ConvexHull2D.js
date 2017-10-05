/**
 * Dada un conjunto finito de puntos (S) en el plano, su cierre convexo es la
 * mínima región convexa que contiene a S.
 * Se puede representar mediante un polígono, donde sus vértices son los puntos
 * de S que definen el borde H.
 *
 * Este módulo sirve como base para las implementaciones de algoritmos que
 * calculan el cierre convexo en este proyecto.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  var Vector  = require('math/Vector');
  var Polygon = require('structures/Polygon');

  var ConvexHull2D = {

    /**
     * Valida que un conjunto de puntos en una entrada válida para el algoritmo
     * de cierre convexo.
     *
     * @param  {Array} input  El conjunto S de puntos (entrada).
     * @return {Boolean}      Si la entrada es válida.
     */
    validateInput: function (input) {
      if (input.length < 3) {
        return false;
      }

      return true;
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
     * Crea un triángulo con los primeros tres puntos de un arreglo de puntos
     * dados.
     * El triángulo está bien formado, es decir, el recorrido de las aristas
     * están orientadas en sentido antihorario.
     *
     * Esta función marca el inicio y base para el algoritmo "Incremental" y el
     * "Divide y Vencerás".
     *
     * @param  {Array} points  Puntos del triángulo.
     * @return {Polygon}       El triángulo, dado como polígono.
     */
    makeTriangle: function (points) {
      var a = points[0],
          b = points[1],
          c = points[2];

      var vertices;
      if (Vector.areaSign(a, b, c) < 0) {
        vertices = [a, b, c];
      } else {
        vertices = [a, c, b];
      }

      return new Polygon(vertices);
    },

    /**
     * Verifica si la línea dirigida ("origin" - "end") es tangente a un cierre
     * convexo (hull). El punto "end" debe ser vértice de "hull".
     *
     * Una línea tangente es aquella que deja contenido completamente a un
     * polígono en un semiplano.
     *
     * Existen dos tipos de tangentes, la que deja al polígono del lado derecho
     * y del lado izquierdo.
     *
     * Si la línea si es una tangente, entonces el punto "end" se conoce como
     * vértice de soporte.
     *
     * @param  {Object}   args             Objeto con los argumentos de la función.
     * @param  {Vector}   args.origin      Punto origen de la linea tangente.
     * @param  {Number}   args.indexOfEnd  El índice del punto final.
     * @param  {Polygon}  args.hull        El cierre convexo.
     * @param  {Function} args.checkSide   Función que verifica si esta del lado deseado.
     * @return {Boolean}                   Si la línea: origin-end es tangente al polígono.
     */
    isTangentLine: function (args) {
      var origin     = args.origin,
          indexOfEnd = args.indexOfEnd,
          checkSide  = args.checkSide,
          vertices   = args.hull.vertices,
          sizeHull   = vertices.length;

      var last = (indexOfEnd === 0) ? vertices[sizeHull - 1]
                                    : vertices[indexOfEnd - 1];
      var end  = vertices[indexOfEnd];
      var next = vertices[(indexOfEnd + 1) % sizeHull];

      var turnToLast = Vector.areaSign(origin, end, last);
      var turnToNext = Vector.areaSign(origin, end, next);

      var sameTurn = (turnToLast * turnToNext) > 0;
      if (!sameTurn) {
        return false;
      }

      return checkSide(turnToLast, turnToNext);
    }
  };

  if (!exports) {
    exports = {};
  }

  module.exports = ConvexHull2D;
});

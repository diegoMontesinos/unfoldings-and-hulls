/**
 * El cierre convexo (H) de un conjunto finito de puntos S es la mínima región
 * convexa que contiene a S.
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
  var Polygon = require('geom/Polygon');

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
     * Crea un triángulo con los primeros tres puntos de un arreglo de puntos
     * dados.
     * El triángulo está bien formado, es decir, el recorrido de las aristas
     * están orientadas en sentido antihorario.
     *
     * Esta función marca el inicio y base para el algoritmo "Incremental" y el
     * "Divide y Vencerás".
     *
     * @param  {Array} points  Puntos del triángulo.
     * @return {Object}        El triángulo, dado como polígono.
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
     * Verifica si la línea dirigida ("origin" - "end") es tangente a un polígono
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
     * @param  {Object} origin        El punto origen de la linea tangente.
     * @param  {Number} indexOfEnd    El índice del punto final. Debe ser un índice dentro de los vértices de "hull".
     * @param  {Object} hull          El polígono convexo.
     * @param  {Boolean} leftTangent  Si estamos probando que es la tangente izquierda.
     * @return {Boolean}              Si la línea: "origin"-"end" es tangente a "hull"
     */
    isTangentLine: function (origin, indexOfEnd, hull, leftTangent) {
      var vertices = hull.vertices;
      var sizeHull = vertices.length;

      var last = (indexOfEnd === 0) ? vertices[sizeHull - 1] : vertices[indexOfEnd - 1];
      var end  = vertices[indexOfEnd];
      var next = vertices[(indexOfEnd + 1) % sizeHull];

      var turnToLast = Vector.areaSign(origin, end, last);
      var turnToNext = Vector.areaSign(origin, end, next);

      var sameTurn = (turnToLast * turnToNext) > 0;
      if (!sameTurn) {
        return false;
      }

      return ((turnToNext < 0) && !leftTangent) ||
             ((turnToNext > 0) && leftTangent);
    }
  };

  if (!exports) {
    exports = {};
  }

  module.exports = ConvexHull2D;
});

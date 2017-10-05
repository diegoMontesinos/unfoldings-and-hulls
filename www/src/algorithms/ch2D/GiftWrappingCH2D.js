/**
 * Implementación del algoritmo "Envoltura de regalo" (también conocido como
 * "marcha de Jarvis"), para calcular el cierre convexo de un conjunto finito de
 * puntos en el plano (S).
 *
 * Como el nombre lo indica muy bien, la idea de este algoritmo es envolver con
 * un hilo (o línea) a todos los puntos de S, justo como si envolvieramos un
 * regalo.
 * Al ir envolviendo a S, la linea se va "doblando" cada vez que encuentra un
 * punto extremo. Estos puntos son los vértices del borde del cierre convexo.
 * Todo el trabajo del algoritmo reside en encontrar a estos puntos.
 *
 * El algoritmo tiene una complejidad de O(nh), donde h es el número de aristas
 * del cierre convexo, pero es O(n^2) en el peor de los casos, cuando h = n.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  var _            = require('underscore');
  var Vector       = require('math/Vector');
  var Polygon      = require('structures/Polygon');
  var ConvexHull2D = require('algorithms/ch2D/ConvexHull2D');

  var GiftWrappingCH2D = {

    /**
     * Ejecuta el algoritmo "envoltura de regalo" para calcular el cierre convexo.
     *
     * @param  {Array} input  El conjunto de puntos de entrada.
     * @return {Polygon}      El cierre convexo calculado, como un polígono.
     */
    run: function (input) {
      if (!this.validateInput(input)) {
        return undefined;
      }

      var indexOfMinPointByY = this.indexOfMinPointByY(input);
      var minPointByY = input[indexOfMinPointByY];

      var hullVertices = this.findWrappingVertices(minPointByY, input);

      return new Polygon(hullVertices);
    },

    /**
     * Devuelve los puntos del conjunto de entrada donde la envoltura se va
     * "doblando", y que forman los vértices del borde del cierre convexo.
     *
     * Se necesita conocer primero un vértice que ya se sabe que está en el
     * cierre convexo para comenzar a envolver (puede ocuparse el mínimo en Y).
     *
     * @param  {Vector} firstPoint  El primer punto en el borde del cierre convexo.
     * @param  {Array}  points      El conjunto de puntos.
     * @return {Array}              Los vértices del borde del cierre convexo.
     */
    findWrappingVertices: function (firstPoint, points) {
      var wrappingVertices = [ firstPoint ];
      var lastPoint = wrappingVertices[0];

      var closed = false;
      while (!closed) {
        lastPoint = this.nextPointInWrapping(lastPoint, points);

        if (!lastPoint.equals(wrappingVertices[0])) {
          wrappingVertices.push(lastPoint);
        } else {
          closed = true;
        }
      }

      return wrappingVertices;
    },

    /**
     * Devuelve al siguiente punto del conjunto de entrada con el que la envolura
     * se "dobla" si se ancla al último punto encontrado.
     *
     * Este siguiente punto es el que hace menor ángulo antihorario con respecto
     * a la última arista encontrada. Por esta razón, también es el punto tal que
     * la línea dirigida que lo une con el punto anterior deja al conjunto de un
     * lado.
     * Por lo tanto, es fácil encontrarlo verificando esta última propiedad.
     *
     * @param  {Vector} lastPoint  El último punto de la envoltura.
     * @param  {Array}  points     El conjunto de puntos.
     * @return {Vector}            El siguiente punto en la envolutra.
     */
    nextPointInWrapping: function (lastPoint, points) {
      var candidate;

      var point;
      for (var i = 0; i < points.length; i++) {
        point = points[i];

        if (point.equals(lastPoint)) {
          continue;
        }

        if (!candidate || Vector.areaSign(lastPoint, point, candidate) < 0) {
          candidate = point;
        }
      }

      return candidate;
    }
  };
  _.extend(GiftWrappingCH2D, ConvexHull2D);

  if (!exports) {
    exports = {};
  }

  module.exports = GiftWrappingCH2D;
});

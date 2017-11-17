/**
 * Funciones de utileria.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  const Vector = require('math/Vector');

  var Utils = {

    /**
     * Crea un conjunto de n puntos aleatorios de tercera dimensión contenidos
     * en una caja creada por dos vectores min y max.
     *
     * Los puntos generados son tales que cada una de sus coordenadas:
     * min.x <= x <= max.x
     * min.y <= y <= max.y
     * min.z <= z <= max.z
     *
     * @param  {Object}  args               Las opciones para el conjunto de puntos
     * @param  {Number}  args.num           El numero de puntos que se desean
     * @param  {Vector}  args.min           El vector minimo (Vector)
     * @param  {Vector}  args.max           El vector máximo (Vector)
     * @param  {Boolean} args.gralPosition  Si se desea posicion general
     * @param  {Boolean} args.in2D          Si el conjunto está en dos dimensiones
     * @return {Array}                      El conjunto generado
     */
    randomPointsInBox: function (args) {
      if (args.num < 0) {
        return undefined;
      }

      var in2D = args.in2D;
      var min  = args.min;
      var max  = args.max;

      var points = [];

      var x, y, z;
      var v;

      while (points.length !== args.num) {
        x = this.randomRange(min.x, max.x);
        y = this.randomRange(min.y, max.y);
        z = in2D ? 0.0 : this.randomRange(min.z, max.z);

        v = new Vector(x, y, z);

        var store = !args.gralPosition || (points.length < 2 || this.isKeepingGeneralPosition(points, v, in2D));
        if (store) {
          points.push(v);
        }
      }

      return points;
    },

    /**
     * Crea un conjunto de n puntos aleatorios de tercera dimensión contenidos
     * en una esfera dada por un centro y un radio.
     *
     * @param  {Object}  args               Las opciones para el conjunto de puntos
     * @param  {Number}  args.num           El numero de puntos que se desean
     * @param  {Vector}  args.center        El centro de la esfera (Vector)
     * @param  {Number}  args.radius        El radio de la esfera
     * @param  {Boolean} args.gralPosition  Si se desea posicion general
     * @param  {Boolean} args.in2D          Si el conjunto está en dos dimensiones
     * @return {Array}                      El conjunto generado
     */
    randomPointsInSphere: function (args) {
      if (args.num < 0) {
        return undefined;
      }

      var in2D = args.in2D;

      var points = [];

      var alpha, beta, r;
      var v;

      while (points.length !== args.num) {
        alpha = this.randomRange(0.0, 2.0 * Math.PI);
        beta  = this.randomRange(0.0, Math.PI);
        r     = this.randomRange(0.0, args.radius);

        if (in2D) {
          v = this.vectoFromPolars(r, alpha);
        } else {
          v = this.vectorFromSphericals(r, alpha, beta);
        }

        v.add(args.center);

        var store = !args.gralPosition || (points.length < 2 || this.isKeepingGeneralPosition(points, v, in2D));
        if (store) {
          points.push(v);
        }
      }

      return points;
    },

    /**
     * Crea un conjunto de n puntos aleatorios de dos dimensiones contenidos en
     * un rectangulo creada por dos vectores min y max.
     *
     * Los puntos generados son tales que cada una de sus coordenadas:
     * min.x <= x <= max.x
     * min.y <= y <= max.y
     *
     * @param  {Object}  args               Las opciones para el conjunto de puntos
     * @param  {Number}  args.num           El numero de puntos que se desean
     * @param  {Vector}  args.min           El vector minimo (Vector)
     * @param  {Vector}  args.max           El vector máximo (Vector)
     * @param  {Boolean} args.gralPosition  Si se desea posicion general
     * @return {Array}                      El conjunto generado
     */
    randomPointsInRect: function (args) {
      return this.randomPointsInBox({
        num          : args.num,
        min          : args.min,
        max          : args.max,
        gralPosition : args.gralPosition,
        in2D         : true
      });
    },

    /**
     * Crea un conjunto de n puntos aleatorios de dos dimensiones contenidos
     * en una circulo dado por su radio y su centro.
     *
     * @param  {Object}  args               Las opciones para el conjunto de puntos
     * @param  {Number}  args.num           El numero de puntos que se desean
     * @param  {Vector}  args.center        El centro de la esfera (Vector)
     * @param  {Number}  args.radius        El radio de la esfera
     * @param  {Boolean} args.gralPosition  Si se desea posicion general
     * @return {Array}                      El conjunto generado
     */
    randomPointsInCircle: function (args) {
      return this.randomPointsInSphere({
        num          : args.num,
        center       : args.center,
        radius       : args.radius,
        gralPosition : args.gralPosition,
        in2D         : true
      });
    },

    /**
     * Prueba si un punto mantiene o no la posicion general en un conjunto de
     * puntos que ya lo esta si fuera añadido.
     *
     * @param  {Array}   points  Un conjunto de puntos que esta en posicion general
     * @param  {Vector}  point   Punto a probar (es un Vector)
     * @param  {Boolean} in2D    Si está en dos dimensiones (se prueba colinearidad)
     * @return {Boolean}         Si el punto mantiene o no la posicion general
     */
    isKeepingGeneralPosition: function (points, vector, in2D) {
      var len = points.length;
      for (var i = 0; i < len; i++) {
        for (var j = (i + 1); j < len; j++) {
          if (in2D) {
            if (Vector.areCollinear(points[i], points[j], vector)) {
              return false;
            }

            continue;
          }

          for (var k = (j + 1); k < len; k++) {
            if (Vector.areCoplanar(points[i], points[j], points[k], vector)) {
              return false;
            }
          }
        }
      }

      return true;
    },

    /**
     * Crea un vector resultante de convertir coordenadas esféricas a cartesianas.
     * Ver: https://es.wikipedia.org/wiki/Coordenadas_esf%C3%A9ricas
     *
     * @param  {Number} r     El radio
     * @param  {Number} alpha Angulo de longitud
     * @param  {Number} beta  Angulo de latitud
     * @return {Vector}       Vector resultante
     */
    vectorFromSphericals: function (r, alpha, beta) {
      var x = r * Math.sin(beta) * Math.cos(alpha);
      var y = r * Math.sin(beta) * Math.sin(alpha);
      var z = r * Math.cos(beta);
      return new Vector(x, y, z);
    },

    /**
    * Crea un vector resultante de convertir coordenadas polares a cartesianas.
    * Ver: https://es.wikipedia.org/wiki/Coordenadas_polares
    *
     * @param  {Number} r     Radio
     * @param  {Number} tetha Angulo
     * @return {Vector}       Vector resultante
     */
    vectoFromPolars: function (r, tetha) {
      var x = r * Math.cos(tetha);
      var y = r * Math.sin(tetha);
      return new Vector(x, y);
    },

    /**
     * Genera un numero aleatorio entre un rango dado.
     *
     * @param  {Number} start Inicio del rango
     * @param  {Number} end   Final del rango
     * @return {Number}       El numero aleatorio generado
     */
    randomRange: function (start, end) {
      var range = end - start;
      return (Math.random() * range) + start;
    }
  };

  if (!exports) {
    exports = {};
  }

  module.exports = Utils;
});

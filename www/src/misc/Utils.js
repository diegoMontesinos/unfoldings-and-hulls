/**
 * Funciones de utileria.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Dependencias
  var Vector = require('math/Vector');

  // Definicion del modulo
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
     * @param  {Object}  options              Las opciones para el conjunto de puntos
     * @param  {Number}  options.num          El numero de puntos que se desean
     * @param  {Object}  options.min          El vector minimo (Vector)
     * @param  {Object}  options.max          El vector máximo (Vector)
     * @param  {Boolean} options.gralPosition Si se desea posicion general
     * @param  {Boolean} options.in2D         Si el conjunto está en dos dimensiones
     * @return {Array}                        El conjunto generado
     */
    randomPointsInBox: function (options) {
      if (options.num < 0) {
        return undefined;
      }

      var in2D = options.in2D;

      var points = [];

      var x, y, z;
      var v;

      while (points.length !== options.num) {
        x = this.randomRange(options.min.x, max.x);
        y = this.randomRange(options.min.y, max.y);
        z = in2D ? 0.0 : this.randomRange(options.min.z, max.z);

        v = new Vector(x, y, z);

        var store = !options.generalPosition || (points.length < 2 || this.isKeepingGeneralPosition(points, v, in2D));
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
     * @param  {Object}  options              Las opciones para el conjunto de puntos
     * @param  {Number}  options.num          El numero de puntos que se desean
     * @param  {Object}  options.center       El centro de la esfera (Vector)
     * @param  {Number}  options.radius       El radio de la esfera
     * @param  {Boolean} options.gralPosition Si se desea posicion general
     * @param  {Boolean} options.in2D         Si el conjunto está en dos dimensiones
     * @return {Array}                        El conjunto generado
     */
    randomPointsInSphere: function (options) {
      if (options.num < 0) {
        return undefined;
      }

      var in2D = options.in2D;

      var points = [];

      var alpha, beta, r;
      var v;

      while (points.length !== options.num) {
        alpha = this.randomRange(0.0, 2.0 * Math.PI);
        beta  = in2D ? 0.0 : this.randomRange(0.0, Math.PI);
        r     = this.randomRange(0.0, options.radius);

        v = this.createVectorFromPolar(r, alpha, beta);
        v.add(options.center);

        var store = !options.generalPosition || (points.length < 2 || this.isKeepingGeneralPosition(points, v, in2D));
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
     * @param  {Object}  options              Las opciones para el conjunto de puntos
     * @param  {Number}  options.num          El numero de puntos que se desean
     * @param  {Object}  options.min          El vector minimo (Vector)
     * @param  {Object}  options.max          El vector máximo (Vector)
     * @param  {Boolean} options.gralPosition Si se desea posicion general
     * @return {Array}                        El conjunto generado
     */
    randomPointsInRect: function (options) {
      return this.randomPointsInBox({
        num          : options.num,
        min          : options.min,
        max          : options.max,
        gralPosition : options.gralPosition,
        in2D         : true
      });
    },

    /**
     * Crea un conjunto de n puntos aleatorios de dos dimensiones contenidos
     * en una circulo dado por su radio y su centro.
     *
     * @param  {Object}  options              Las opciones para el conjunto de puntos
     * @param  {Number}  options.num          El numero de puntos que se desean
     * @param  {Object}  options.center       El centro de la esfera (Vector)
     * @param  {Number}  options.radius       El radio de la esfera
     * @param  {Boolean} options.gralPosition Si se desea posicion general
     * @return {Array}                        El conjunto generado
     */
    randomPointsInCircle: function (options) {
      return this.randomPointsInSphere({
        num          : options.num,
        center       : options.center,
        radius       : options.radius,
        gralPosition : options.gralPosition,
        in2D         : true
      });
    },

    /**
     * Prueba si un punto mantiene o no la posicion general en un conjunto de
     * puntos que ya lo esta si fuera añadido.
     *
     * @param  {Array}   points  Un conjunto de puntos que esta en posicion general
     * @param  {Object}  point   Punto a probar (es un Vector)
     * @param  {Boolean} in2D    Si está en dos dimensiones (se prueba colinearidad)
     * @return {Boolean}         Si el punto mantiene o no la posicion general
     */
    isKeepingGeneralPosition: function (points, vector, in2D) {
      var len = points.length;
      for (var i = 0; i < len; i++) {
        for (var j = (i + 1); j < len; j++) {
          if (in2D) {
            if (Vector.areColinear(points[i], points[j], point)) {
              return false
            }

            continue;
          }

          for (var k = (j + 1); k < len; k++) {
            if (Vector.areCoplanar(points[i], points[j], points[k], point)) {
              return false;
            }
          }
        }
      }

      return true;
    },

    /**
     * Crea un vector de tres dimensiones a partir de sus coordenadas polares.
     * Ver: https://es.wikipedia.org/wiki/Coordenadas_esf%C3%A9ricas
     *
     * @param  {Number} r     El radio
     * @param  {Number} alpha Angulo de longitud
     * @param  {Number} beta  Angulo de latitud
     * @return {Object}       Vector resultante
     */
    createVectorFromPolar: function (r, alpha, beta) {
      var x = r * Math.sin(beta) * Math.cos(alpha);
      var y = r * Math.sin(beta) * Math.sin(alpha);
      var z = r * Math.cos(beta);
      return new Vector(x, y, z);
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

  // Regresa la definicion del modulo como resultado
  module.exports = Utils;
});

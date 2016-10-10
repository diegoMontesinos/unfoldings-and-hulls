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
  var Vector3 = require('math/Vector3');

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
     * @param  { Number }  n               El numero de puntos que se desean
     * @param  { Object }  minVec          El vector minimo (Vector3)
     * @param  { Object }  maxVec          El vector máximo (Vector3)
     * @param  { Boolean } generalPosition Si se desea posicion general
     * @return { Array }                   El conjunto generado
     */
    randomPointsInBox: function ( n, minVec, maxVec, generalPosition ) {
      var points = [];

      var x, y, z;
      var v;

      while (points.length !== n) {
        x = this.randomRange(minVec.x, maxVec.x);
        y = this.randomRange(minVec.y, maxVec.y);
        z = this.randomRange(minVec.z, maxVec.z);

        v = new Vector3(x, y, z);

        var store = !generalPosition || (points.length < 2 || this.isKeepingGeneralPosition(points, v));
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
     * @param  { Number }  n               El numero de puntos que se desean
     * @param  { Object }  center          El centro de la esfera (Vector3)
     * @param  { Number }  radius          El radio de la esfera
     * @param  { Boolean } generalPosition Si se desea posicion general
     * @return { Array }                   El conjunto generado
     */
    randomPointsInSphere: function ( n, center, radius, generalPosition ) {
      var points = [];

      var alpha, beta, r;
      var v;

      while (points.length !== n) {
        alpha = this.randomRange(0.0, 2.0 * Math.PI);
        beta  = this.randomRange(0.0, Math.PI);
        r     = this.randomRange(0.0, radius);

        v = this.createVector3FromPolar(r, alpha, beta);
        v.add(center);

        var store = !generalPosition || (points.length < 2 || this.isKeepingGeneralPosition(points, v));
        if (store) {
          points.push(v);
        }
      }

      return points;
    },

    /**
     * Prueba si un punto mantiene o no la posicion general en un conjunto de
     * puntos que ya lo esta.
     *
     * @param  { Array }  points Un conjunto de puntos que esta en posicion general
     * @param  { Object }  vec   Punto a probar (es un Vector3)
     * @return { Boolean }       Si el punto mantiene o no la posicion general
     */
    isKeepingGeneralPosition: function ( points, vec ) {
      var len = points.length;
      for (var i = 0; i < len; i++) {
        for (var j = (i + 1); j < len; j++) {
          for (var k = (j + 1); k < len; k++) {
            if (Vector3.areCoplanar(points[i], points[j], points[k], vec)) {
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
     * @param  { Number } r     El radio
     * @param  { Number } alpha Angulo de longitud
     * @param  { Number } beta  Angulo de latitud
     * @return { Object }       Vector resultante
     */
    createVector3FromPolar: function ( r, alpha, beta ) {
      var x = r * Math.sin(beta) * Math.cos(alpha);
      var y = r * Math.sin(beta) * Math.sin(alpha);
      var z = r * Math.cos(beta);
      return new Vector3(x, y, z);
    },

    randomRange: function ( start, end ) {
      var range = end - start;
      return (Math.random() * range) + start;
    },

    binarySearchVertex: function ( start, end, vertexArray, searchVertex ) {
      if (start <= end) {
        var middle = (start + end) / 2 | 0;

        var comparation = vertexArray[middle].compareTo(searchVertex);
        if (comparation < 0) {
          return this.binarySearchVertex(middle + 1, end, vertexArray, searchVertex);
        } else if (comparation > 0) {
          return this.binarySearchVertex(start, middle - 1, vertexArray, searchVertex);
        } else {
          return middle;
        }
      }

      return start;
    }
  };

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = Utils;
});

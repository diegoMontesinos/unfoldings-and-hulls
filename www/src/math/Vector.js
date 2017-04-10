/**
 * Representa a un vector en el espacio. También se puede ocupar (como en gran
 * parte de este proyecto) para representar a un punto.
 * A pesar de que tiene tres coordenadas, omitiendo la tercera (z = 0), hace que
 * el vector esté en el plano.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  var EPSILON = 1e-12;

  /**
   * Construye un vector dadas sus coordenadas.
   *
   * @param  {Number} x  Coordenada x del vector.
   * @param  {Number} y  Coordenada y del vector.
   * @param  {Number} z  Coordenada z del vector.
   * @return {Object}    El vector construido.
   */
  var Vector = function (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };

  /**
   * Evalua si el vector que invoca la función es igual a otro dado.
   *
   * @param  {Object} v  El vector dado.
   * @return {Boolean}   Si los vectores son iguales.
   */
  Vector.prototype.equals = function (v) {
    return Math.abs(this.x - v.x) <= EPSILON &&
           Math.abs(this.y - v.y) <= EPSILON &&
           Math.abs(this.z - v.z) <= EPSILON;
  };

  /**
   * Calcula el vector resultante de proyectar el vector que invoca la función
   * sobre otro dado.
   *
   * @param  {Object} v  El vector a proyectar.
   * @return {Object}    La proyeccion del vector.
   */
  Vector.prototype.projectOn = function (v) {
    if (v.length() !== 1.0) {
      v = v.clone();
      v.normalize();
    }

    var len = this.dot(v);
    var x = len * v.x;
    var y = len * v.y;
    var z = len * v.z;

    return new Vector(x, y, z);
  };

  /**
   * Calcula el producto punto del vector que invoca la función con otro dado.
   *
   * @param  {Object} v  El otro vector dado.
   * @return {Number}    El producto punto calculado.
   */
  Vector.prototype.dot = function (v) {
    return (this.x * v.x) + (this.y * v.y);
  };

  /**
   * Suma un vector al vector que invoca la funcion.
   *
   * @param  {Object} v  El vector a sumar.
   */
  Vector.prototype.add = function (v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  };

  /**
   * Calcula el area con signo del paralelogramo derivado por tres puntos.
   *
   * Este calculo se basa en el producto vectorial, o producto cruz, eliminando
   * uno de los vectores llevandolo al origen (restandoselo a los otros). Esto es:
   * (a - c) x (b - c).
   *
   * @param  {Object} a  Primer vertice.
   * @param  {Object} b  Primer vertice.
   * @param  {Object} c  Primer vertice.
   * @return {Number}    El área con signo del paralelogramo.
   */
  Vector.area2 = function (a, b, c) {
    var ax = (a.x - c.x), ay = (a.y - c.y);
    var bx = (b.x - c.x), by = (b.y - c.y);

    var area = (ax * by) - (ay * bx);
    return area;
  };

  /**
   * Función de ayuda para comparaciones, u operaciones basadas en el giro que da
   * una linea dirigida de un vector a, a un vecto b, dirigiendose a un vector c.
   *
   * En realidad es un alias de la función Vector.area2, pero permite redondeo de
   * una epsilon para evitar errores de aproximación.
   *
	 * 0 : colineal
	 * - : vuelta a la izquierda
	 * + : vuelta a la derecha
   *
   * @param  {Object} a  Primer vertice.
   * @param  {Object} b  Primer vertice.
   * @param  {Object} c  Primer vertice.
   * @return {Number}    El signo de la vuelta.
   */
  Vector.areaSign = function (a, b, c) {
    var area = Vector.area2(a, b, c);
    if (area < -EPSILON) {
      return -1;
    } else if (area > EPSILON) {
      return 1;
    } else {
      return 0;
    }
  };

  /**
   * Evalua si tres puntos dados son colineales o no.
   *
   * @param  {Object} a  Primer vertice.
   * @param  {Object} b  Primer vertice.
   * @param  {Object} c  Primer vertice.
   * @return {Boolean}   Si son colineales o no.
   */
  Vector.areCollinear = function (a, b, c) {
    return Vector.areaSign(a, b, c) === 0;
  };

  /**
   * Calcula el volumen con signo del paralelepipedo derivado por cuatro
   * puntos.
   *
   * Este calculo se basa en el triple producto vectorial, eliminando uno de los
   * vectores llevandolo al origen (restandoselo a los otros). Esto es:
   * ((a - d) x (b - d)) x (c - d)
   *
   * @param  {Object} a  Primer vertice
   * @param  {Object} b  Segundo vertice
   * @param  {Object} c  Tercer vertice
   * @param  {Object} d  Cuarto vertice
   * @return {Number}    Volumen con signo
   */
  Vector.volume3 = function (a, b, c, d) {
    var ax = (a.x - d.x), ay = (a.y - d.y), az = (a.z - d.z);
    var bx = (b.x - d.x), by = (b.y - d.y), bz = (b.z - d.z);
    var cx = (c.x - d.x), cy = (c.y - d.y), cz = (c.z - d.z);

    var vol = ax * (by * cz - bz * cy) +
              ay * (bz * cx - bx * cz) +
              az * (bx * cy - by * cx);

    return vol;
  };

  /**
   * Función de ayuda para comparaciones, u operaciones basadas en saber si un
   * punto c esta en el semiespacio apuntado por la normal (de frente) del plano
   * generado por los puntos a, b, c (siguiendo la regla de la mano derecha).
   *
   * En realidad es un alias de la función Vector.volume3, pero permite redondeo
   * de una epsilon para evitar errores de aproximación.
   *
	 * 0 : coplanar
	 * - : detras de la normal
	 * + : de frente a la normal
   *
   * @param  {Object} a  Primer vertice.
   * @param  {Object} b  Primer vertice.
   * @param  {Object} c  Primer vertice.
   * @param  {Object} d  Cuarto vertice
   * @return {Number}    El signo contra la normal.
   */
  Vector.volumeSign = function (a, b, c, d) {
    var volume = Vector.volume3(a, b, c, d);
    if (volume < -0.5) {
      return -1;
    } else if (volume > 0.5) {
      return 1;
    } else {
      return 0;
    }
  };

  /**
   * Evalua si cuatro puntos son coplanares.
   *
   * @param  {Object} a  Primer vertice.
   * @param  {Object} b  Primer vertice.
   * @param  {Object} c  Primer vertice.
   * @param  {Object} d  Cuarto vertice
   * @return {Boolean}   Si son coplanares o no.
   */
  Vector.areCoplanar = function (a, b, c, d) {
    return Vector.volumeSign(a, b, c, d) === 0;
  };

  /**
   * Devuelve una función comparadora de vectores por un eje dado.
   * Es decir, regresa un comparador para vectores basado en una coordenada
   * dada.
   *
   * @param  {String} axis  La coordenada a comparar: 'x', 'y' o 'z'.
   * @return {Function}     El comparador.
   */
  Vector.comparatorByAxis = function (axis) {
    return function (v0, v1) {
      return (v0[axis] - v1[axis]);
    };
  };

  /**
   * Comparador lexicografico de vectores.
   * Primero los compara por su coordenada 'x'.
   * En caso de tener el mismo valor en 'x', los compara con 'y'.
   * En caso de tener el mismo valor en 'y', los compara con 'z'.
   *
   * @param  {Object} v0 Un vector a comparar.
   * @param  {Object} v1 El otro vector a comparar.
   * @return {Number}    El resultado de la comparacion:
   *                          0 si son iguales,
   *                          < 0 si v0 es mayor que v1,
   *                          > 0 si v0 es menor que v1.
   */
  Vector.lexicographicalComparator = function (v0, v1) {
    var difference = v0.x - v1.x;
    difference = (difference === 0.0) ? (v0.y - v1.y) : difference;
    difference = (difference === 0.0) ? (v0.z - v1.z) : difference;

    return difference;
  };

  if (!exports) {
    exports = {};
  }

  module.exports = Vector;
});

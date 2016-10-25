/**
 * Representa un vector de tres coordenadas
 * Extiende la implementación hecha en THREE.Vector3
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Dependencias
  var THREE = require('three');

  // Definicion del modulo
  var Vector3 = function ( x, y, z ) {
    THREE.Vector3.call(this, x, y, z);
  };

  Vector3.prototype = Object.create(THREE.Vector3.prototype);
  Vector3.prototype.constructor = Vector3;

  /**
   * Calcula el volumen con signo del paralelepipedo derivado por cuatro
   * puntos.
   *
   * Este calculo se basa en el triple producto vectorial, eliminando uno de los
   * vectores llevandolo al origen (restandoselo a los otros). Esto es:
   * ((a - d) x (b - d)) x (c - d)
   *
   * @param  { Object } a Primer vertice
   * @param  { Object } b Segundo vertice
   * @param  { Object } c Tercer vertice
   * @param  { Object } d Cuarto vertice
   * @return { Number }   Volumen con signo
   */
  Vector3.volume3 = function ( a, b, c, d ) {

    // Transladamos los puntos para que d quede en el origen
    var ax = (a.x - d.x), ay = (a.y - d.y), az = (a.z - d.z);
    var bx = (b.x - d.x), by = (b.y - d.y), bz = (b.z - d.z);
    var cx = (c.x - d.x), cy = (c.y - d.y), cz = (c.z - d.z);

    var vol = ax * (by * cz - bz * cy) +
              ay * (bz * cx - bx * cz) +
              az * (bx * cy - by * cx);

    return vol;
  };

  Vector3.volumeSign = function ( a, b, c, d ) {
    var volume = Vector3.volume3(a, b, c, d);
    if (volume < -0.5) {
      return -1;
    } else if (volume > 0.5) {
      return 1;
    } else {
      return 0;
    }
  };

  Vector3.areCoplanar = function ( a, b, c, d ) {
    return Vector3.volumeSign(a, b, c, d) === 0;
  };

  Vector3.prototype.equals = function ( v ) {
    var epsilon = 1e-10;
    return Math.abs(this.x - v.x) <= epsilon &&
           Math.abs(this.y - v.y) <= epsilon &&
           Math.abs(this.z - v.z) <= epsilon;
  };

  /**
   * Comparador lexicografico.
   *
   * @param  { Object } v   Un Vector3 para comparar
   * @return { Number }     El resultado de la comparacion:
   *                          0 si son iguales,
   *                          < 0 si este vector es menor que el pasado
   *                          > 0 si este vector es mayo que el pasado
   */
  Vector3.prototype.compareTo = function ( v ) {
    if (!this.equals(v)) {
      var diff = this.x - v.x;
      diff = diff === 0.0 ? this.y - v.y : diff;
      diff = diff === 0.0 ? this.z - v.z : diff;

      if (diff !== 0) {
        return diff / Math.abs(diff);
      }
    }

    return 0;
  };

  /**
   * Calcula el vector resultante de proyectar
   * este vector sobre otro dado.
   *
   * @param  { Object } v El vector a proyectar
   * @return { Object }   La proyeccion del vector
   */
  Vector3.prototype.projectOn = function ( v ) {
    if (v.length() !== 1.0) {
      v = v.clone();
      v.normalize();
    }

    var len = this.dot(v);
    var x = len * v.x;
    var y = len * v.y;
    var z = len * v.z;

    return new Vector3(x, y, z);
  };

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = Vector3;
});

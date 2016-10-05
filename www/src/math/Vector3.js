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

  /**
   * Calcula el volumen con signo del tetraedro formado por cuatro
   * vectores basado en el producto cruz.
   *
   * @param  { Object } a Primer vertice del tetraedro
   * @param  { Object } b Segundo vertice del tetraedro
   * @param  { Object } c Tercer vertice del tetraedro
   * @param  { Object } d Cuarto vertice del tetraedro
   * @return { Number }   Volumen con signo calculada
   */
  Vector3.volume3 = function ( a, b, c, d ) {

    // Transladamos los puntos para que d quede en el origen
    var ax = a.x - d.x, ay = a.y - d.y, az = a.z - d.z;
    var bx = b.x - d.x, by = b.y - d.y, bz = b.z - d.z;
    var cx = c.x - d.x, cy = c.y - d.y, cz = c.z - d.z;

    var vol = ax * (by * cz - bz * cy) + ay * (bz * cx - bx * cz) + az * (bx * cy - by * cx);
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

  Vector3.prototype = Object.create(THREE.Vector3.prototype);
  Vector3.prototype.constructor = Vector3;

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = Vector3;
});

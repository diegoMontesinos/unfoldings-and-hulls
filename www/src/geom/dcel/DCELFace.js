/**
 * Cara de una DCEL.
 *
 * Para los terminos de este proyecto todas las caras son triangulos.
 * Si se desean caras poligonales estas tendran que ser descompuestas en triangulos.
 *
 * La orientación de las aristas sigue la regla de la mano derecha.
 * Esta regla nos dice que si se alinea la orientacion de los dedos de la mano
 * derecha con la orientacion de las  aritas, el dedo pulgar debe apuntar hacia
 * afuera de la DCEL.
 * Esto indica también la dirección del vector normal de la cara.
 *
 * Este modulo extiende a THREE.Face3
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
  var DCELFace = function ( heA, heB, heC ) {
    var a = heA.iOrigin;
    var b = heB.iOrigin;
    var c = heC.iOrigin;
    THREE.Face3.call(this, a, b, c);

    this.heA = heA;
    this.heB = heB;
    this.heC = heC;
  };

  DCELFace.prototype = Object.create(THREE.Face3);
  DCELFace.prototype.constructor = DCELFace;

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = DCELFace;
});

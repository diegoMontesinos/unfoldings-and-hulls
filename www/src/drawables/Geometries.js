/**
 * Coleccion de Geometrias predefinidas.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Dependencias
  const THREE = require('three');

  // Definición del módulo
  var Geometries = {
    POINT_GEOMETRY : new THREE.CircleBufferGeometry(1.5, 4)
  };

  if (!exports) {
    exports = {};
  }

  module.exports = Geometries;
});

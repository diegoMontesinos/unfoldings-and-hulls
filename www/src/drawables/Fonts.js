/**
 * Tipografias 3D de la app.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Debug ID
  const debug = require('debug')('objects:fonts');

  // Dependencias
  const $     = require('jquery');
  const THREE = require('three');

  // Constantes
  const FONT_NAMES = {
    DEFAULT_FONT : 'helvetiker_regular'
  };

  // Definición del módulo
  var Fonts = {};

  Fonts.load = function (doneCallback) {
    debug('Loading fonts...');

    var loader = new THREE.FontLoader();
    var promises = [];

    for (var fontKey in FONT_NAMES) {
      if (FONT_NAMES.hasOwnProperty(fontKey)) {
        var promise = loadFont(loader, fontKey, FONT_NAMES[fontKey]);
        promises.push(promise);
      }
    }

    $.when.apply($, promises).then(function () {
      debug('Fonts loaded!');
      doneCallback();
    });
  };

  function loadFont (loader, fontKey, fontName) {
    var deferred = $.Deferred();

    var url = 'fonts/' + fontName + '.typeface.json';
    loader.load(url, function (font) {
      Fonts[fontKey] = font;
      deferred.resolve();
    });

    return deferred.promise();
  }

  if (!exports) {
    exports = {};
  }

  module.exports = Fonts;
});

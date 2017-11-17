/**
 * Este modulo exporta un objeto singleton de la aplicacion.
 * Es el punto de entrada para toda la logica.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Debug ID
  const debug = require('debug')('app');

  // Dependencias
  const $ = require('jquery');

  // Assets
  const Fonts = require('drawables/Fonts');

  // Vistas
  const WorkspaceViewController = require('views/WorkspaceViewController');

  var UnfoldingsAndHulls = function () {
    debug('Setup app');

    var workspaceContainer = document.getElementById('workspace-container');
    this.workspace = new WorkspaceViewController(workspaceContainer);
  };

  UnfoldingsAndHulls.prototype = {

    loadAssets: function (doneCallback) {
      debug('Loading assets...');

      var assetsModules = [ Fonts ];
      var promises = [];
      for (var i = 0; i < assetsModules.length; i++) {
        var promise = loadAssetModule(assetsModules[i]);
        promises.push(promise);
      }

      $.when.apply($, promises).then(function () {
        debug('Assets loaded!');
        doneCallback();
      });
    },

    start: function () {
      debug('Starting app');

      this.workspace.start();
    }
  };

  function loadAssetModule (assetModule) {
    var deferred = $.Deferred();
    if (!assetModule.load) {
      deferred.resolve();
    } else {
      assetModule.load(function () {
        deferred.resolve();
      });
    }

    return deferred.promise();
  }

  if (!exports) {
    exports = {};
  }

  // Regresa un singleton como resultado del módulo
  module.exports = new UnfoldingsAndHulls();
});

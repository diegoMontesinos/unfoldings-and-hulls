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
  var debug = require('debug')('app');

  var WorkspaceViewController = require('views/workspace/WorkspaceViewController');

  var UnfoldingsAndHulls = function () {
    debug('Setup app');

    var workspaceContainer = document.getElementById('workspace-container');
    
    this.workspaceView = new WorkspaceViewController(workspaceContainer);
    this.workspaceView.start();
  };

  UnfoldingsAndHulls.prototype = {

    start: function () {
      debug('Starting app');
    }
  };

  if (!exports) {
    exports = {};
  }

  // Regresa un singleton como resultado del módulo
  module.exports = new UnfoldingsAndHulls();
});

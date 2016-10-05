/**
 * This module exports a singleton instance of the "Unfoldings and Hulls" app.
 * Is the starting point for the app.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Faculty of Science, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Set debug ID
  var debug = require('debug')('app');

  // Application dependencies
  var Scene = require('./scene/Scene');

  // Application definition
  var UnfoldingsAndHulls = function () {
    debug('Setup app');

    this.debugMode = true;
    this.scene     = new Scene(this);
  };

  UnfoldingsAndHulls.prototype = {
    start : function () {
      debug('Starting app');

      this.scene.start();
    }
  };

  // Simple exports check
  if (!exports) {
    exports = {};
  }

  // Return application instance as module export
  var app = new UnfoldingsAndHulls();
  module.exports = app;
});

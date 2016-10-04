define(function (require, exports, module) {
  'use strict';

  // Set debug ID
  var debug = require('debug')('app');

  // Application definition
  var UnfoldingsAndHulls = function () {
  };

  UnfoldingsAndHulls.prototype = {
    start : function () {
      debug('Starting app');
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

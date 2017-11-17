define(function (require, exports, module) {
  'use strict';

  if (!exports) {
    exports = {};
  }

  // Export all steps
  module.exports = {
    Initial : require('runner/ch2D/IncrementalCH2D/InitialStep'),
    Append  : require('runner/ch2D/IncrementalCH2D/AppendStep')
  };
});


requirejs.config({
	baseUrl: '.',
	paths: {
		'chai':'./node_modules/chai/chai'
	}
});

mocha.setup({
	ui: 'bdd',
	ignoreLeaks: true
});

require(['chai'], function (chai) {
	window.chai = chai;
	window.stubs = {};

	var __define = define;
	window.define = function (deps, cb) {
		if (Array.isArray(deps)) {
			var i, dep;
			for (i = 0; i < deps.length; i++){
				if (stubs[deps[i]]) {
					dep = deps[i];
					break;
				}
			}

			if (dep) {
				__define(deps, function() {
					arguments[i] = stubs[deps[i]];
					return cb.apply(null, arguments);
				});

				return;
			}
		}
		__define(deps, cb);
	};

	var testSuites = suites || [];
	for (var i = 0; i < testSuites.length; i++) {
		testSuites[i] = 'test/tests/' + testSuites[i];
	}
	require(testSuites, mocha.run);
});

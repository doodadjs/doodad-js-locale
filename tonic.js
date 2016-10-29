"use strict";

const modules = {};
require('doodad-js-unicode').add(modules);
require('doodad-js-locale').add(modules);

require('doodad-js').createRoot(modules)
	.then(root => {
		const locale = root.Doodad.Tools.Locale;
		return locale.load('fr_FR');
	})
	.then(loc => {
		console.log(loc);
	})
	['catch'](function(err) {
		console.error(err);
	});
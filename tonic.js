"use strict";

const root = require('doodad-js').createRoot( /*bootstrapModules*/ null, /*options*/ { node_env: 'development' } );

const modules = {};
require('doodad-js-unicode').add(modules);
require('doodad-js-locale').add(modules);

function startup() {
	const locale = root.Doodad.Tools.Locale;
	return locale.loadLocale('fr_FR').then(function(loc) {
		console.log(loc);
	});
};

root.Doodad.Namespaces.loadNamespaces( modules, startup )
	['catch'](function(err) {
		console.error(err);
	});
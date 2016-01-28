"use strict";

const root = require('doodad-js').createRoot( /*bootstrapModules*/ null, /*options*/ { node_env: 'development' } );

const modules = {};
require('doodad-js-locale').add(modules);

root.Doodad.Namespaces.loadNamespaces( function callback() {
	
	const locale = root.Doodad.Tools.Locale;
	return locale.loadLocale('fr_FR').then(function(loc) {
		console.log(loc);
	});
	
}, /*donThrow*/ false, /*options*/ null, modules )
	['catch'](function(err) {
		console.error(err);
	});
//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// dOOdad - Object-oriented programming framework
// File: Tools_Locale.js - Useful locale tools
// Project home: https://sourceforge.net/projects/doodad-js/
// Trunk: svn checkout svn://svn.code.sf.net/p/doodad-js/code/trunk doodad-js-code
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2016 Claude Petit
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//		http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//! END_REPLACE()

(function() {
	var global = this;

	var exports = {};
	
	//! BEGIN_REMOVE()
	if ((typeof process === 'object') && (typeof module === 'object')) {
	//! END_REMOVE()
		//! IF_DEF("serverSide")
			module.exports = exports;
		//! END_IF()
	//! BEGIN_REMOVE()
	};
	//! END_REMOVE()
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Tools.Locale'] = {
			version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE() */,
			
			create: function create(root, /*optional*/_options, _shared) {
				"use strict";

				var doodad = root.Doodad,
					types = doodad.Types,
					tools = doodad.Tools,
					namespaces = doodad.Namespaces,
					modules = doodad.Modules,
					files = tools.Files,
					unicode = tools.Unicode,
					locale = tools.Locale;

				var __Internal__ = {
					current: null,
					cache: {},
				};

				//types.complete(_shared.Natives, {
				//});
				
				var __options__ = types.extend({
					localesPath: './locales/', // Combined with package's root folder
				}, _options);

				//__options__. = types.to....(__options__.);

				types.freezeObject(__options__);

				locale.getOptions = function() {
					return __options__;
				};
				

				// TODO: Make a better and common resources locator and loader
				__Internal__.resourcesLoader = {
					locate: function locate(fileName, /*optional*/options) {
						return modules.locate('doodad-js-locale')
							.then(function(location) {
								var localesPath = _shared.pathParser(__options__.localesPath);
								var filePath = _shared.pathParser(fileName);
								return location.set({file: null})
									.combine(localesPath)
									.combine(filePath);
							});
					},
					load: function load(path, /*optional*/options) {
						var headers = {
							Accept: 'application/json',
						};
						var file = files.readFile(path, { async: true, encoding: 'utf-8', enableCache: true, headers: headers });
						return file;
					},
				};


				locale.setResourcesLoader = function setResourcesLoader(loader) {
					__Internal__.resourcesLoader = loader;
				};
				
				__Internal__.parseLocale = function parseLocale(data) {
					data = JSON.parse(data);
					return data;
				};
				
				
				locale.loadLocale = function loadLocale(name) {
					if (types.has(__Internal__.cache, name)) {
						var Promise = types.getPromise();
						return Promise.resolve(__Internal__.cache[name]);
					} else {
						var loader = __Internal__.resourcesLoader;
						return loader.locate(name + '.json')
							.then(function(path) {
								return loader.load(path);
							})
							.then(__Internal__.parseLocale)
							.then(function(loc) {
								__Internal__.cache[name] = loc;
								return loc;
							})
							['catch'](function(ex) {
								tools.log(tools.LogLevels.Warning, "Failed to load locale '~0~': '~1~'.", [name, ex]);
								throw ex;
							});
					};
				};

				locale.setLocale = function setLocale(/*optional*/name) {
					if (!name) {
						name = tools.getDefaultLanguage();
					};
					return locale.loadLocale(name).then(function(loc) {
						__Internal__.current = loc;
						return loc;
					});
				};

				locale.getCurrent = function getCurrent() {
					return __Internal__.current;
				};


				
				return function init(/*optional*/options) {
					var name = tools.getDefaultLanguage();
					return locale.setLocale(name)
						['catch'](function(ex) {
							if (name === 'en_US') {
								tools.log(tools.LogLevels.Warning, "Failed to load system locale '~0~'.", [name]);
							} else {
								tools.log(tools.LogLevels.Warning, "Failed to load system locale '~0~'. Will try loading 'en_US'.", [name]);
								return locale.setLocale('en_US');
							};
						});
				};
			},
		};
		
		return DD_MODULES;
	};
	
	//! BEGIN_REMOVE()
	if ((typeof process !== 'object') || (typeof module !== 'object')) {
	//! END_REMOVE()
		//! IF_UNDEF("serverSide")
			// <PRB> export/import are not yet supported in browsers
			global.DD_MODULES = exports.add(global.DD_MODULES);
		//! END_IF()
	//! BEGIN_REMOVE()
	};
	//! END_REMOVE()
}).call(
	//! BEGIN_REMOVE()
	(typeof window !== 'undefined') ? window : ((typeof global !== 'undefined') ? global : this)
	//! END_REMOVE()
	//! IF_DEF("serverSide")
	//! 	INJECT("global")
	//! ELSE()
	//! 	INJECT("window")
	//! END_IF()
);
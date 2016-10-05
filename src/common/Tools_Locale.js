//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Tools_Locale.js - Useful locale tools
// Project home: https://github.com/doodadjs/
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

module.exports = {
	add: function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Tools.Locale'] = {
			version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
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
					cache: types.nullObject(),
					defaultCountries: types.nullObject({
						// TODO: Complete
						en: 'us',
						es: 'es',
						fr: 'fr',
						it: 'it',
					}),
					momentNamesFix: types.nullObject({
						// TODO: Complete
						'en-us': 'en',
						'es-es': 'es',
						'fr-fr': 'fr',
						'it-it': 'it',
					}),
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
					const LC_MOMENT = types.get(data, 'LC_MOMENT');
					if (LC_MOMENT) {
						data.LC_MOMENT = null; // in case of failure
							//const loadData = new global.Function('exports', 'module', 'require', 'define', LC_MOMENT);
							//const requireMoment = function(path) {
							//	return require('moment');
							//};
							//loadData.call(global, {}, module, requireMoment, undefined, LC_MOMENT);
						const moment = {
							defineLocale: function(name, data) {
								data.name = name;
								return data;
							},
						};
						const define = function(whatever, factory) {
							data.LC_MOMENT = factory(moment);
						};
						define.amd = true;
						const getData = new global.Function('exports', 'module', 'require', 'define', LC_MOMENT);
						getData.call(global, undefined, undefined, undefined, define);
					};
					return data;
				};
				
				
				locale.has = function has(name) {
					name = locale.momentToDoodadName(name);
					return (name in __Internal__.cache);
				};
				
				locale.get = function has(name) {
					name = locale.momentToDoodadName(name);
					return (__Internal__.cache[name] || null);
				};
				
				locale.load = function load(name) {
					var Promise = types.getPromise();
					return Promise['try'](function tryLoadLocale() {
						name = locale.momentToDoodadName(name);
						if (locale.has(name)) {
							return locale.get(name);
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
					});
				};

				locale.setCurrent = function setLocale(/*optional*/name) {
					if (!name) {
						name = tools.getDefaultLanguage();
					};
					return locale.load(name).then(function(loc) {
						__Internal__.current = loc;
					});
				};

				locale.getCurrent = function getCurrent() {
					return __Internal__.current;
				};

				__Internal__.fixMomentName = function fixMomentName(name) {
					if (name in __Internal__.momentNamesFix) {
						name = __Internal__.momentNamesFix[name];
					};
					return name;
				};

				locale.doodadToMomentName = function(name, /*optional*/noCountry) {
					if (tools.indexOf(name, '_') < 0) {
						// Already "moment" name
						return name;
					};
					return __Internal__.fixMomentName(tools.split(name.split('@', 1)[0], '_', (noCountry ? 1 : 2)).join('-').toLowerCase());
				};
				
				__Internal__.appendDefaultCountry = function appendDefaultCountry(name) {
					if (name in __Internal__.defaultCountries) {
						name += '-' + __Internal__.defaultCountries[name];
					};
					return name;
				};

				locale.momentToDoodadName = function(name) {
					if (tools.indexOf(name, '_') >= 0) {
						// Already Doodad name
						return name;
					};
					name = __Internal__.appendDefaultCountry(name);
					name = tools.split(name, '-', 2);
					const ctry = name[1];
					if (ctry) {
						name[1] = ctry.toUpperCase();
					};
					return name.join('_');
				};

				return function init(/*optional*/options) {
					var name = tools.getDefaultLanguage();
					return locale.setCurrent(name)
						['catch'](function(ex) {
							if (name === 'en_US') {
								tools.log(tools.LogLevels.Warning, "Failed to load system locale '~0~'.", [name]);
							} else {
								tools.log(tools.LogLevels.Warning, "Failed to load system locale '~0~'. Will try loading 'en_US'.", [name]);
								return locale.setCurrent('en_US');
							};
						});
				};
			},
		};
		return DD_MODULES;
	},
};
//! END_MODULE()
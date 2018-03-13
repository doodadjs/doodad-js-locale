//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Tools_Locale.js - Useful locale tools
// Project home: https://github.com/doodadjs/
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2015-2018 Claude Petit
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

//! IF_SET("mjs")
//! ELSE()
	"use strict";
//! END_IF()

exports.add = function add(DD_MODULES) {
	DD_MODULES = (DD_MODULES || {});
	DD_MODULES['Doodad.Tools.Locale'] = {
		version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
		create: function create(root, /*optional*/_options, _shared) {
			const doodad = root.Doodad,
				types = doodad.Types,
				tools = doodad.Tools,
				//namespaces = doodad.Namespaces,
				resources = doodad.Resources,
				modules = doodad.Modules,
				//files = tools.Files,
				//unicode = tools.Unicode,
				locale = tools.Locale;

			const __Internal__ = {
				current: null,
				cache: tools.nullObject(),
				defaultCountries: tools.nullObject({
					// TODO: Complete
					en: 'us',
					es: 'es',
					fr: 'fr',
					it: 'it',
					ru: 'ru',
				}),
				momentNamesFix: tools.nullObject({
					// TODO: Complete
					'en-us': 'en',
					'es-es': 'es',
					'fr-fr': 'fr',
					'it-it': 'it',
					'ru-ru': 'ru',
				}),
			};

			//tools.complete(_shared.Natives, {
			//});
				
			//const __options__ = tools.extend({
			//	localesPath: './locales/', // Combined with package's root folder
			//}, _options);

			//__options__. = types.to....(__options__.);

			//types.freezeObject(__options__);

			//locale.ADD('getOptions', function() {
			//	return __options__;
			//});
				

			locale.ADD('has', function has(name) {
				name = locale.momentToDoodadName(name);
				return (name in __Internal__.cache);
			});
				
			locale.ADD('get', function has(name) {
				name = locale.momentToDoodadName(name);
				return (__Internal__.cache[name] || null);
			});
				
			locale.ADD('load', function load(name) {
				const Promise = types.getPromise();
				return Promise.try(function tryLoadLocale() {
					name = locale.momentToDoodadName(name);
					if (locale.has(name)) {
						return locale.get(name);
					} else {
						const loader = locale.getResourcesLoader();
						return loader.locate('./locales/' + name + '.json')
							.then(function(path) {
								return loader.load(path);
							})
							.then(function(loc) {
								loc.NAME = name;
								__Internal__.cache[name] = loc;
								return loc;
							})
							.catch(function(ex) {
								tools.log(tools.LogLevels.Warning, "Failed to load locale '~0~': '~1~'.", [name, ex]);
								throw ex;
							});
					};
				});
			});

			locale.ADD('setCurrent', function setLocale(/*optional*/name) {
				const Promise = types.getPromise();
				if (!name) {
					name = tools.getDefaultLanguage();
				};
				if (locale.has(name)) {
					const loc = locale.get(name);
					__Internal__.current = loc;
					return Promise.resolve(loc);
				} else {
					return locale.load(name)
						.then(function(loc) {
							__Internal__.current = loc;
						});
				};
			});

			locale.ADD('getCurrent', function getCurrent() {
				return __Internal__.current;
			});

			__Internal__.fixMomentName = function fixMomentName(name) {
				if (name in __Internal__.momentNamesFix) {
					name = __Internal__.momentNamesFix[name];
				};
				return name;
			};

			locale.ADD('doodadToMomentName', function(name, /*optional*/noCountry) {
				if (tools.indexOf(name, '_') < 0) {
					// Already "moment" name
					return name;
				};
				return __Internal__.fixMomentName(name.split('@', 1)[0].split('_', (noCountry ? 1 : 2)).join('-').toLowerCase());
			});
				
			__Internal__.appendDefaultCountry = function appendDefaultCountry(name) {
				if (name in __Internal__.defaultCountries) {
					name += '-' + __Internal__.defaultCountries[name];
				};
				return name;
			};

			locale.ADD('momentToDoodadName', function(name) {
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
			});

			return function init(/*optional*/options) {
				const name = tools.getDefaultLanguage();
				return modules.locate('@doodad-js/locale')
					.then(function(path) {
						const basePath = path.set({file: null});
						resources.createResourcesLoader(locale, basePath);
						return locale.setCurrent(name);
					})
					.catch(function(ex) {
						if (name === 'en_US') {
							tools.log(tools.LogLevels.Warning, "Failed to load system locale '~0~'.", [name]);
						} else {
							tools.log(tools.LogLevels.Warning, "Failed to load system locale '~0~'. Will try loading 'en_US'.", [name]);
							return locale.setCurrent('en_US');
						};
						return undefined;
					});
			};
		},
	};
	return DD_MODULES;
};

//! END_MODULE()

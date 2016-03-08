//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n")
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
	if (typeof process === 'object') {
		module.exports = exports;
	};
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Tools.Locale'] = {
			type: null,
			version: '1.3.0r',
			namespaces: null,
			dependencies: [
				'Doodad.Tools', 
				'Doodad.Tools.Files', 
				'Doodad.Tools.Unicode', 
				'Doodad.Types', 
				'Doodad.Namespaces', 
				'Doodad.Modules',
			],
			
			create: function create(root, /*optional*/_options) {
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
					categories: null,
					current: null,
					cache: {},
					oldSetOptions: null,
				};

				var __Natives__ = {
					windowParseInt: global.parseInt,
					windowRegExp: global.RegExp,
				};
				
				__Internal__.oldSetOptions = locale.setOptions;
				locale.setOptions = function setOptions(/*paramarray*/) {
					var options = __Internal__.oldSetOptions.apply(this, arguments),
						settings = types.getDefault(options, 'settings', {});
						
					settings.enableDomObjectsModel = types.toBoolean(types.get(settings, 'enableDomObjectsModel'));
					settings.defaultScriptTimeout = __Natives__.windowParseInt(types.get(settings, 'defaultScriptTimeout'));
				};
				
				locale.setOptions({
					settings: {
						resourcesPath: './res/', // Combined with package's root folder
						localesPath: './locales/', // Combined with "resourcesPath"
					},
					hooks: {
						// TODO: Make a better and common resources locator and loader
						resourcesLoader: {
							locate: function locate(fileName, /*optional*/options) {
								return modules.locate('doodad-js-locale')
									.then(function(location) {
										return location.set({file: null}).combine(files.getOptions().hooks.pathParser(locale.getOptions().settings.resourcesPath)).combine(files.getOptions().hooks.pathParser(fileName));
									});
							},
							load: function load(path, /*optional*/options) {
								var headers = {
									Accept: '*/*',
								};
								var file = files.readFile(path, { async: true, encoding: 'utf8', enableCache: true, headers: headers });
								var callback = types.get(options, 'callback');
								if (callback) {
									file = file.nodeify(function(err, data) {
										callback(err, data);
										if (err) {
											throw err;
										} else {
											return data;
										};
									});
								};
								return file;
							},
						},
					},
				}, _options);
					
				if (global.process && root.getOptions().settings.fromSource) {
					locale.setOptions({
						settings: {
							resourcesPath: './src/common/res/',
						},
					});
				};
				

				__Internal__.parseDefinitionsFile = function parseDefinitionsFile(data, macros, variables) {
					var result,
						lastIndex = 0,
						wordsSepRegEx = /(\r\n)+|(\n\r)+|\r+|\n+|\t+|[ ]+|[(]|[)]|[,]|["]|[/][/]|[/][*]|[*][/]/g,
						macs = [],
						mac = null,
						isCommentBlock = false,
						isComment = false,
						isStr = false,
						word = '',
						words = [];
					while (result = wordsSepRegEx.exec(data)) {
						var str = data.slice(lastIndex, result.index);
						if (isCommentBlock) {
							if (result[0] === '\x2A\x2F') {
								isCommentBlock = false;
							};
						} else if (isComment) {
							str = result[0];
							if ((str[0] === '\r') || (str[0] === '\n')) {
								isComment = false;
							};
						} else if (result[0] === '"') {
							isStr = !isStr;
							if (!isStr) {
								words.push(word + str);
							};
							word = '';
						} else if (isStr) {
							word += (str + result[0]);
						} else if (result[0] === '/*') {
							isCommentBlock = true;
						} else if (result[0] === '//') {
							isComment = true;
						} else if (result[0] === '(') {
							words = [];
							macs.push([mac, words]);
							mac = null;
						} else {
							if (str) {
								if (types.hasKey(macros, str)) {
									mac = macros[str];
								} else if (types.hasKey(variables, str)) {
									words.push(variables[str]);
								} else {
									words.push(str);
								};
							};
							if (result[0] === ')') {
								var macDef = macs.pop();
								mac = macDef[0];
								if (macs.length) {
									words = macs[macs.length - 1][1];
								} else {
									words = [];
								};
								if (mac) {
									word = mac.apply(locale, macDef[1]);
									mac = null;
								} else {
									words.push(word);
								};
							};
						};
						lastIndex = wordsSepRegEx.lastIndex;
					};
				};
				
				__Internal__.unicodeRegEx = /<U([0-9A-Fa-f]{4,8})>([.][.]<U([0-9A-Fa-f]{4,8})>)?/g;
				
				__Internal__.parseLocaleFileString = function parseLocaleFileString(str) {
					return str.replace(__Internal__.unicodeRegEx, function (m, p1, p2, p3, o, s) {
						var from = __Natives__.windowParseInt(p1, 16),
							to = (p3 ? __Natives__.windowParseInt(p3, 16) : from),
							result = '';
						for (var code = from; code <= to; code++) {
							result += unicode.fromCodePoint(code);
						};
						return result;
					});
				};

				__Internal__.parseLocaleFileCodePoints = function parseLocaleFileCodePoints(str) {
					var retval = [];
					__Internal__.unicodeRegEx.lastIndex = 0;
					var result = __Internal__.unicodeRegEx.exec(str);
					var regexp = "";
					while (result) {
						var from = __Natives__.windowParseInt(result[1], 16),
							to = (result[2] ? __Natives__.windowParseInt(result[3], 16) : from);
						for (var code = from; code <= to; code++) {
							// NOT NEEDED FOR THE MOMENT
							//retval.push(code);
							if ((from >= 0x10000) || (to >= 0x10000)) {
								if (code >= 0x10000) {
									var chr = unicode.fromCodePoint(code);
									regexp += "|\\u" + ("000" + chr.charCodeAt(0).toString(16)).slice(-4) + "\\u" + ("000" + chr.charCodeAt(1).toString(16)).slice(-4);
								} else {
									regexp += "|\\u" + ("000" + code.toString(16)).slice(-4);
								};
							};
						};
						if ((from < 0x10000) && (to < 0x10000)) {
							if (from === to) {
								regexp += "|\\u" + ("000" + from.toString(16)).slice(-4)
							} else {
								regexp += "|[\\u" + ("000" + from.toString(16)).slice(-4) + "-\\u" + ("000" + to.toString(16)).slice(-4) + "]"
							};
						};
						result = __Internal__.unicodeRegEx.exec(str);
					};
					retval.regExpStr = regexp;
					return retval;
				};

				__Internal__.parseLocaleFile = function parseLocaleFile(data, /*optional*/sectionFilter, /*optional*/sections, /*optional*/translit) {
					var Promise = types.getPromise();
					return new Promise(function(resolve, reject) {
						var result,
							chr,
							lastIndex = 0,
							section = null,
							sectionName = null,
							variableName = null,
							isComment = false,
							isEscape = false,
							isStr = false,
							directive = null,
							word = '',
							words = null,
							commentChar = '%',
							escapeChar = '/',
							wordsSepRegEx;

						if (!sections) {
							sections = {};
						};
						
						translit = translit || 0;
							
						var createRegEx = function createRegEx() {
							var lastIndex = 0;
							if (wordsSepRegEx) {
								lastIndex = wordsSepRegEx.lastIndex;
							};
							var newRegExp = new __Natives__.windowRegExp('(\\r\\n)+|(\\n\\r)+|\\r+|\\n+|\\t+|[ ]+|[;]|["]|' + tools.escapeRegExp(commentChar) + '|' + tools.escapeRegExp(escapeChar), 'g');
							newRegExp.lastIndex = lastIndex;
							return newRegExp;
						};
						
						wordsSepRegEx = createRegEx();
						
						var waiting = [];
						
						while (result = wordsSepRegEx.exec(data)) {
							var str = data.slice(lastIndex, result.index);
							chr = result[0];
							if (directive) {
								word += str;
								if ((chr[0] === '\r') || (chr[0] === '\n')) {
									if (directive === 'escape_char') {
										escapeChar = word;
										wordsSepRegEx = createRegEx();
									} else if (directive === 'comment_char') {
										commentChar = word;
										wordsSepRegEx = createRegEx();
									};
									directive = null;
									word = '';
								} else {
									word += chr;
								};
							} else if (isEscape) {
								isEscape = false;
							} else if (chr === escapeChar) {
								isEscape = true;
								if (isStr) {
									word += str;
								};
							} else if (isComment) {
								if ((chr[0] === '\r') || (chr[0] === '\n')) {
									isComment = false;
								};
							} else if (chr === commentChar) {
								isComment = true;
							} else if (isStr) {
								word += str;
								if ((chr[0] === '\r') || (chr[0] === '\n') || (chr === '"')) {
									word = __Internal__.parseLocaleFileString(word);
									isStr = false;
								} else {
									word += chr;
								};
							} else if (chr === '"') {
								isStr = true;
							} else if (variableName && (chr === ';')) {
								// Array separator
								word += str;
								if (words) {
									words.push(word);
								} else {
									words = [word];
								};
								word = '';
							} else {
								word += str;
								if (!variableName) {
									variableName = word;
									word = '';
								};
								if ((chr[0] === '\r') || (chr[0] === '\n')) {
									if (section) {
										if ((variableName === 'END') && (word === sectionName)) {
											section = null;
											sectionName = null;
											translit = 0;
										} else if (!sectionFilter || (sectionName === sectionFilter)) {
											if (sectionName === 'LC_COLLATE') {
												// TODO: LC_COLLATE
												//if (variableName === 'define') {
												//} else if (variableName === 'ifdef') {
												//} else if (variableName === 'ifndef') {
												//} else if (variableName === 'else') {
												//} else if ....
												//....
											} else if ( (variableName === 'include') || (variableName === 'copy') ) {
												if (word) {
													waiting.push(__Internal__.loadLocale(word, sectionName, sections, translit));
												};
											} else if (sectionName === 'LC_CTYPE') {
												if (variableName === 'translit_start') {
													translit++;
												} else if (variableName === 'translit_end') {
													translit--;
												} else if (translit > 0) {
													// TODO: translit table
												} else if ((variableName === 'class') || types.hasKey(section.classes, variableName)) {
													if (word) {
														if (words) {
															words.push(word);
														} else {
															words = [word];
														};
													};
													if (variableName === 'class') {
														variableName = words.shift();
													};
													var cls = tools.reduce(words, function(result, value) {
														var codePoints = __Internal__.parseLocaleFileCodePoints(value);
														// NOT NEEDED FOR THE MOMENT
														//for (var i = 0; i < codePoints.length; i++) {
														//	var codePoint = codePoints[i];
														//	result.chars.push(unicode.fromCodePoint(codePoint));
														//};
														result.regExpStr += codePoints.regExpStr;
														return result;
													}, {
														// NOT NEEDED FOR THE MOMENT
														//chars: [],
														regExpStr: '',
														regExp: null,
													});
													cls.regExpStr = cls.regExpStr.slice(1);
													cls.regExp = new __Natives__.windowRegExp(cls.regExpStr);
													section.classes[variableName] = cls;
												} else if ((variableName === 'map') || types.hasKey(section.maps, variableName)) {
													// NOT NEEDED FOR THE MOMEMT
													// if (word) {
														// if (words) {
															// words.push(word);
														// } else {
															// words = [word];
														// };
													// };
													// if (variableName === 'map') {
														// variableName = words.shift();
													// };
													// section.maps[variableName] = words.map(function(value) {
														// var parts = value.slice(1, -1).split(',', 2);
														// var result = {};
														// result[__Internal__.parseLocaleFileString(parts[0])] = __Internal__.parseLocaleFileString(parts[1]);
														// return result;
													// });
												};
											} else if (variableName && word) {
												if (words) {
													words.push(word);
													if (types.hasKey(section, variableName)) {
														var val = section[variableName];
														if (!types.isArray(val)) {
															section[variableName] = val = [val];
														};
														types.append(val, words);
													} else {
														section[variableName] = words;
													};
												} else {
													if (types.hasKey(section, variableName)) {
														var val = section[variableName];
														if (types.isArray(val)) {
															val.push(word);
														} else {
															section[variableName] = [val, word];
														};
													} else {
														section[variableName] = word;
													};
												};
											};
										};
									} else {
										sectionName = variableName;
										section = types.get(sections, sectionName);
										if (!section) {
											if (sectionName === 'LC_CTYPE') {
												section = {
													classes: { upper: {}, lower: {}, alpha: {}, digit: {}, outdigit: {}, space: {}, cntrl: {}, punct: {}, graph: {}, print: {}, xdigit: {}, blank: {}},
													maps: { toupper: [], tolower: [] },
												};
											} else {
												section = {};
											};
											sections[sectionName] = section;
										};
									};
									words = null;
									word = '';
									variableName = null;
								} else if (!section) {
									directive = variableName;
									variableName = null;
								};
							};

							lastIndex = wordsSepRegEx.lastIndex;
						};
						
						Promise.all(waiting)
							.then(function() {
								resolve(sections);
							})
							['catch'](reject);
					});
				};
				
				__Internal__.loadCategories = function loadCategories() {
					var Promise = types.getPromise();
					if (__Internal__.categories) {
						return Promise.resolve();
					};
					__Internal__.categories = {};
					return locale.getOptions().hooks.resourcesLoader.locate(files.getOptions().hooks.pathParser(locale.getOptions().settings.localesPath).combine(files.getOptions().hooks.pathParser('categories.def')))
						.then(function(path) {
							return locale.getOptions().hooks.resourcesLoader.load(path)
								.then(function proceed(data) {
									var __items = {};
									
									__Internal__.parseDefinitionsFile(data, {
										DEFINE_CATEGORY: function(id, name, items, postload) {
											__Internal__.categories[id] = {
												name: name,
												items: __items,
												postload: postload,
											};
											locale[id] = id;
											//__items = {};
										},
										DEFINE_ELEMENT: function(id, name, standard, type, min, max) {
											__items[id] = {
												name: name,
												standard: standard,
												type: type,
												min: min && __Natives__.windowParseInt(min) || undefined,
												max: max && __Natives__.windowParseInt(max) || undefined,
											};
										},
									}, {
										NO_POSTLOAD: null,
									});
									
									locale['LC_ALL'] = 'LC_ALL';
									
									
									return locale.setLocale( locale.LC_ALL, "" );
								});
						});
				};

				__Internal__.loadLocale = function loadLocaleInternal(name, /*optional*/category, /*optional*/sections, /*optional*/translit) {
					var Promise = types.getPromise();
					var cached = !sections && types.get(__Internal__.cache, name);
					if (cached) {
						return Promise.resolve(cached);
					};
					return locale.getOptions().hooks.resourcesLoader.locate(files.getOptions().hooks.pathParser(locale.getOptions().settings.localesPath).combine(files.getOptions().hooks.pathParser(name)))
						.then(function(path) {
							return locale.getOptions().hooks.resourcesLoader.load(path)
								.then(function proceed(data) {
									//console.log(data);
									return __Internal__.parseLocaleFile(data, category, sections, translit)
										.then(function (loc) {
											if ((!category || (category === locale.LC_ALL)) && !sections) {
												__Internal__.cache[name] = loc;
											};
										
											return loc;
										});
								});
						});
				};
				
				locale.loadLocale = function loadLocale(name) {
					return __Internal__.loadLocale(name);
				};

				locale.setLocale = function setLocale(/*optional*/category, /*optional*/name) {
					if (!name) {
						name = tools.getDefaultLanguage();
					};
					return locale.loadLocale(name).then(function(loc) {
						if (!category || (category === locale.LC_ALL)) {
							__Internal__.current = loc;
						} else {
							__Internal__.current[category] = loc[category];
						};
						return loc;
					});
				};

				locale.getCurrent = function getCurrent() {
					return __Internal__.current;
				};


				
				return function init(/*optional*/options) {
					return __Internal__.loadCategories();
				};
			},
		};
		
		return DD_MODULES;
	};
	
	if (typeof process !== 'object') {
		// <PRB> export/import are not yet supported in browsers
		global.DD_MODULES = exports.add(global.DD_MODULES);
	};	
}).call((typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this));

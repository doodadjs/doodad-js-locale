//! REPLACE_BY("// Copyright 2015 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework with some extras
// File: Tools_Locale.js - Useful locale tools
// Project home: https://sourceforge.net/projects/doodad-js/
// Trunk: svn checkout svn://svn.code.sf.net/p/doodad-js/code/trunk doodad-js-code
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2015 Claude Petit
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
	if (global.process) {
		module.exports = exports;
	};
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Tools.Locale'] = {
			type: null,
			version: '1r',
			namespaces: null,
			dependencies: ['Doodad.Tools'],
			
			create: function create(root, /*optional*/_options) {
				"use strict";

				var doodad = root.Doodad,
					types = doodad.Types,
					tools = doodad.Tools,
					namespaces = doodad.Namespaces,
					files = tools.Files,
					locale = tools.Locale;

					
				_options = types.depthExtend(2, {
					settings: {
						localePath: './res/locales/',
					},
				}, _options);
					
					
				var __Internal__ = {
	//				categories: {},
					current: {
						categories: {
							/***********************************************************************************/
							
							//! REPLACE_BY("\n// Copyright (C) 2002-2015 Free Software Foundation, Inc.\n")
							/* Copyright (C) 2002-2015 Free Software Foundation, Inc.
							   The following is a translation of the file 'en_US' of the GNU C Library.

							   The GNU C Library is free software; you can redistribute it and/or
							   modify it under the terms of the GNU Lesser General Public
							   License as published by the Free Software Foundation; either
							   version 2.1 of the License, or (at your option) any later version.

							   The GNU C Library is distributed in the hope that it will be useful,
							   but WITHOUT ANY WARRANTY; without even the implied warranty of
							   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
							   Lesser General Public License for more details.

							   You should have received a copy of the GNU Lesser General Public
							   License along with the GNU C Library; if not, see
							   <http://www.gnu.org/licenses/>.  */
							//! END_REPLACE()
							
	/* NOT NEEDED FOR THE MOMENT
							LC_IDENTIFICATION: {
								title:     "English locale for the USA",
								source:    "Free Software Foundation, Inc.",
								address:   "http://www.gnu.org/software/libc/",
								contact:   "",
								email:     "bug-glibc-locales@gnu.org",
								tel:       "",
								fax:       "",
								language:  "English",
								territory: "USA",
								revision:  "1.0",
								date:      "2000-06-24",
								category:  ["en_US:2000", "LC_IDENTIFICATION", "en_US:2000", "LC_TIME"],
							},
	*/
							LC_TIME: {
								abday: ["\u0053\u0075\u006E", "\u004D\u006F\u006E",
									"\u0054\u0075\u0065","\u0057\u0065\u0064",
									"\u0054\u0068\u0075","\u0046\u0072\u0069",
									"\u0053\u0061\u0074"],
								day: ["\u0053\u0075\u006E\u0064\u0061\u0079",
									"\u004D\u006F\u006E\u0064\u0061\u0079",
									"\u0054\u0075\u0065\u0073\u0064\u0061\u0079",
									"\u0057\u0065\u0064\u006E\u0065\u0073\u0064\u0061\u0079",
									"\u0054\u0068\u0075\u0072\u0073\u0064\u0061\u0079",
									"\u0046\u0072\u0069\u0064\u0061\u0079",
									"\u0053\u0061\u0074\u0075\u0072\u0064\u0061\u0079"],

								week: [7,19971130,7],
								first_weekday: 1,
								first_workday: 2,
								abmon: ["\u004A\u0061\u006E","\u0046\u0065\u0062",
									"\u004D\u0061\u0072","\u0041\u0070\u0072",
									"\u004D\u0061\u0079","\u004A\u0075\u006E",
									"\u004A\u0075\u006C","\u0041\u0075\u0067",
									"\u0053\u0065\u0070","\u004F\u0063\u0074",
									"\u004E\u006F\u0076","\u0044\u0065\u0063"],
								mon: ["\u004A\u0061\u006E\u0075\u0061\u0072\u0079",
									"\u0046\u0065\u0062\u0072\u0075\u0061\u0072\u0079",
									"\u004D\u0061\u0072\u0063\u0068",
									"\u0041\u0070\u0072\u0069\u006C",
									"\u004D\u0061\u0079",
									"\u004A\u0075\u006E\u0065",
									"\u004A\u0075\u006C\u0079",
									"\u0041\u0075\u0067\u0075\u0073\u0074",
									"\u0053\u0065\u0070\u0074\u0065\u006D\u0062\u0065\u0072",
									"\u004F\u0063\u0074\u006F\u0062\u0065\u0072",
									"\u004E\u006F\u0076\u0065\u006D\u0062\u0065\u0072",
									"\u0044\u0065\u0063\u0065\u006D\u0062\u0065\u0072"],
								// Appropriate date and time representation (%c)
								//	"%a %d %b %Y %r %Z"
								d_t_fmt: "\u0025\u0061\u0020\u0025\u0064\u0020\u0025\u0062\u0020\u0025\u0059\u0020\u0025\u0072\u0020\u0025\u005A",
								//
								// Appropriate date representation (%x)
								//	"%m/%d/%Y"
								d_fmt: "\u0025\u006D\u002F\u0025\u0064\u002F\u0025\u0059",
								//
								// Appropriate time representation (%X)
								//	"%r"
								t_fmt: "\u0025\u0072",
								//
								// Appropriate AM/PM time representation (%r)
								//	"%I:%M:%S %p"
								t_fmt_ampm: "\u0025\u0049\u003A\u0025\u004D\u003A\u0025\u0053\u0020\u0025\u0070",
								//
								// Strings for AM/PM
								//
								am_pm: ["\u0041\u004D","\u0050\u004D"],
								//
								// Appropriate date representation (date(1))   "%a %b %e %H:%M:%S %Z %Y"
								date_fmt: "\u0025\u0061\u0020\u0025\u0062\u0020\u0025\u0065\u0020\u0025\u0048\u003A\u0025\u004D\u003A\u0025\u0053\u0020\u0025\u005A\u0020\u0025\u0059",
							},
							/***********************************************************************************/
							//! INSERT("\n// Copyright 2015 Claude Petit, licensed under Apache License version 2.0\n")
						},
					},
					cache: {},
				};
				
					
				__Internal__.getFileUrl = function(fileName) {
					var localePath = tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})());
					localePath = localePath.combine(tools.options.hooks.pathParser(_options.settings.localePath, {os: 'linux', file: fileName, isRelative: null}));
					return localePath;
				};
				
	/* NOT NEEDED FOR THE MOMENT		
				__Internal__.parseDefinitionsFile = function parseDefinitionsFile(data, macros, variables) {
					var result,
						lastIndex = 0,
						wordsSepRegEx = /\r\n+|\n\r+|\r+|\n+|\t+|[ ]+|[(]|[)]|[,]|["]|[/][/]|[/][*]|[*][/]/g,
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
	*/

				__Internal__.parseLocaleFile = function parseLocaleFile(data, sectionsDef, /*optional*/sectionFilter, /*optional*/sections) {
					var Promise = tools.getPromise();
					return new Promise(function(resolve, reject) {
						var result,
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
							wordsSepRegEx,
							unicodeRegEx = /<U([0-9A-Fa-f]{4,})>/g;

						if (!sections) {
							sections = {};
						};
							
						var createRegEx = function createRegEx() {
							var lastIndex = 0;
							if (wordsSepRegEx) {
								lastIndex = wordsSepRegEx.lastIndex;
							};
							var newRegExp = new RegExp('\\r\\n+|\\n\\r+|\\r+|\\n+|\\t+|[ ]+|[;]|["]|' + tools.escapeRegExp(commentChar) + '|' + tools.escapeRegExp(escapeChar), 'g');
							newRegExp.lastIndex = lastIndex;
							return newRegExp;
						};
						
						wordsSepRegEx = createRegEx();
						
						var waiting = [];
						
						while (result = wordsSepRegEx.exec(data)) {
							var str = data.slice(lastIndex, result.index);
							result = result[0];
							if (directive) {
								word += str;
								if ((result[0] === '\r') || (result[0] === '\n')) {
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
									word += result;
								};
							} else if (isEscape) {
								isEscape = false;
							} else if (result === escapeChar) {
								isEscape = true;
							} else if (isComment || isStr) {
								if ((result[0] === '\r') || (result[0] === '\n')) {
									isComment = false;
									isStr = false;
								} else if (isStr) {
									str = str.replace(unicodeRegEx, function(m, p1, o, s) {
										return String.fromCharCode(parseInt(p1, 16));
									});
									word += str;
									if (result === '"') {
										isStr = false;
									} else {
										word += result;
									};
								};
							} else if (result === '"') {
								isStr = true;
							} else if (result === commentChar) {
								isComment = true;
							} else if (variableName && (result === ';')) {
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
								if ((result[0] === '\r') || (result[0] === '\n')) {
									if (section) {
										if ((variableName === 'END') && (word === sectionName)) {
											section = null;
											sectionName = null;
										} else if (!sectionFilter || (sectionName === sectionFilter)) {
											if (variableName === 'copy') {
												if (word) {
													waiting.push(__Internal__.loadLocale(word, sectionName, sections));
												};
											} else if (variableName === 'include') {
												// TODO:
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
											sections[sectionName] = section = {};
										};
									};
									variableName = null;
									words = null;
									word = '';
								} else if (!section) {
									if ((variableName === 'escape_char') || (variableName === 'comment_char')) {
										directive = variableName;
									};
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
				
	/* NOT NEEDED FOR THE MOMENT
				__Internal__.loadCategories = function loadCategories() {
					return files.readFile(__Internal__.getFileUrl('categories.def'), {async: true, encoding: 'utf8', enableCache: true}).then(function proceed(data) {
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
									min: min && parseInt(min) || undefined,
									max: max && parseInt(max) || undefined,
								};
							},
						}, {
							NO_POSTLOAD: null,
						});
						
						locale['LC_ALL'] = 'LC_ALL';
						
						
						return locale.setLocale( locale.LC_ALL, "" );
					});
				};
	*/
						locale.LC_TIME = 'LC_TIME';
						locale.LC_ALL = 'LC_ALL';

				__Internal__.loadLocale = function loadLocaleInternal(name, /*optional*/category, /*optional*/sections) {
					var Promise = tools.getPromise();
					var cached = !sections && types.get(__Internal__.cache, name);
					if (cached) {
						return Promise.resolve(cached);
					};
					var path = __Internal__.getFileUrl(name);
		//console.log(path);
					return files.readFile(path, {async: true, encoding: 'utf8', enableCache: true})
						.then(function proceed(data) {
		//console.log(data);
							return __Internal__.parseLocaleFile(data, __Internal__.categories, category, sections)
								.then(function(loc) {
									loc = {
										categories: loc,
									};
									
									if (!category && !sections) {
										__Internal__.cache[name] = loc;
									};
									
									return loc;
								});
						});
				};
				
				locale.loadLocale = function loadLocale(name) {
					return __Internal__.loadLocale(name, locale.LC_TIME);
				};

				locale.setLocale = function setLocale(/*optional*/category, /*optional*/name) {
					if (!name) {
						name = tools.getDefaultLanguage();
					};
					return locale.loadLocale(name).then(function(loc) {
						if (!category || (category === locale.LC_ALL)) {
							__Internal__.current = loc;
						} else {
							__Internal__.current.categories[category] = loc.categories[category];
						};
						return loc;
					});
				};

				locale.getCurrent = function getCurrent() {
					return __Internal__.current;
				};



				
				return function init(/*optional*/options) {
					// NOT NEEDED FOR THE MOMENT
					//return __Internal__.loadCategories();
						return locale.setLocale( locale.LC_ALL, "");
						
					//// Test
					//return locale.loadLocale('fr_CA').nodeify(function(err, locale) {
					//	console.log(err);
					//	console.log(locale);
					//});
				};
			},
		};
		
		return DD_MODULES;
	};
	
	if (!global.process) {
		// <PRB> export/import are not yet supported in browsers
		global.DD_MODULES = exports.add(global.DD_MODULES);
	};	
})();

//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// dOOdad - Object-oriented programming framework
// File: Tools_Locale_Make.js - Make extension
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
	const global = this;
	
	const exports = {};
	
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
		DD_MODULES['Doodad.Tools.Locale.Make'] = {
			version: '0.1.0a',
			dependencies: [
				'doodad-js-unicode',
				'doodad-js-make',
			],
			
			create: function create(root, /*optional*/_options) {
				"use strict";

				//===================================
				// Get namespaces
				//===================================
					
				const doodad = root.Doodad,
					types = doodad.Types,
					tools = doodad.Tools,
					files = tools.Files,
					unicode = tools.Unicode,
					make = root.Make,
					locale = tools.Locale,
					localeMake = locale.Make,
					
					nodeFs = require('fs');
					
				//===================================
				// Natives
				//===================================
					
				const __Natives__ = {
					windowParseInt: global.parseInt,
					windowRegExp: global.RegExp,
				};
					
				//===================================
				// Internal
				//===================================
					
				const __Internal__ = {
					unicodeRegEx: /<U([0-9A-Fa-f]{4,8})>([.][.]<U([0-9A-Fa-f]{4,8})>)?/g,
				};
				
				
				__Internal__.parseLocaleFileString = function parseLocaleFileString(str) {
					return str.replace(__Internal__.unicodeRegEx, function (m, p1, p2, p3, o, s) {
						const from = __Natives__.windowParseInt(p1, 16),
							to = (p3 ? __Natives__.windowParseInt(p3, 16) : from);
						let result = '';
						for (let code = from; code <= to; code++) {
							result += unicode.fromCodePoint(code);
						};
						return result;
					});
				};

				__Internal__.parseLocaleFileCodePoints = function parseLocaleFileCodePoints(str) {
					const retval = [];
					__Internal__.unicodeRegEx.lastIndex = 0;
					let result = __Internal__.unicodeRegEx.exec(str);
					let regexp = "";
					while (result) {
						const from = __Natives__.windowParseInt(result[1], 16),
							to = (result[2] ? __Natives__.windowParseInt(result[3], 16) : from);
						let currentLeadSurrogate = -1,
							firstTailSurrogate = -1,
							lastTailSurrogate = -1;
						for (let code = from; code <= to; code++) {
							// NOT NEEDED FOR THE MOMENT
							//retval.push(code);
							if ((from >= 0x10000) || (to >= 0x10000)) {
								if (code >= 0x10000) {
									const surrogates = unicode.codePointToCharCodes(code);
									if (from === to) {
										regexp += "|\\u" + ("000" + surrogates.leadSurrogate.toString(16)).slice(-4) + "\\u" + ("000" + surrogates.tailSurrogate.toString(16)).slice(-4);
									} else {
										if (surrogates.leadSurrogate !== currentLeadSurrogate) {
											if (firstTailSurrogate >= 0) {
												regexp += "|\\u" + ("000" + currentLeadSurrogate.toString(16)).slice(-4);
												if (firstTailSurrogate === lastTailSurrogate) {
													regexp += "\\u" + ("000" + firstTailSurrogate.toString(16)).slice(-4);
												} else {
													regexp += "[\\u" + ("000" + firstTailSurrogate.toString(16)).slice(-4) + "-\\u" + ("000" + lastTailSurrogate.toString(16)).slice(-4) + "]";
												};
											};
											currentLeadSurrogate = surrogates.leadSurrogate;
											firstTailSurrogate = surrogates.tailSurrogate;
										};
										lastTailSurrogate = surrogates.tailSurrogate;
									};
								} else {
									regexp += "|\\u" + ("000" + code.toString(16)).slice(-4);
								};
							};
						};
						if (firstTailSurrogate >= 0) {
							regexp += "|\\u" + ("000" + currentLeadSurrogate.toString(16)).slice(-4);
							if (firstTailSurrogate === lastTailSurrogate) {
								regexp += "\\u" + ("000" + firstTailSurrogate.toString(16)).slice(-4);
							} else {
								regexp += "[\\u" + ("000" + firstTailSurrogate.toString(16)).slice(-4) + "-\\u" + ("000" + lastTailSurrogate.toString(16)).slice(-4) + "]";
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
//console.log(regexp);
					return retval;
				};

				__Internal__.parseLocaleFile = function parseLocaleFile(rootPath, data, /*optional*/sectionFilter, /*optional*/sections, /*optional*/translit) {
					const Promise = types.getPromise();
					return new Promise(function(resolve, reject) {
						let result,
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
							
						function createRegEx() {
							let lastIndex = 0;
							if (wordsSepRegEx) {
								lastIndex = wordsSepRegEx.lastIndex;
							};
							const newRegExp = new __Natives__.windowRegExp('(\\r\\n)+|(\\n\\r)+|\\r+|\\n+|\\t+|[ ]+|[;]|["]|' + tools.escapeRegExp(commentChar) + '|' + tools.escapeRegExp(escapeChar), 'g');
							newRegExp.lastIndex = lastIndex;
							return newRegExp;
						};
						
						wordsSepRegEx = createRegEx();
						
						const waiting = [];
						
						while (result = wordsSepRegEx.exec(data)) {
							const str = data.slice(lastIndex, result.index);
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
													waiting.push(__Internal__.loadLocale(rootPath, word, sectionName, sections, translit));
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
													const cls = tools.reduce(words, function(result, value) {
														const codePoints = __Internal__.parseLocaleFileCodePoints(value);
														// NOT NEEDED FOR THE MOMENT
														//for (let i = 0; i < codePoints.length; i++) {
														//	const codePoint = codePoints[i];
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
														// const parts = value.slice(1, -1).split(',', 2);
														// const result = {};
														// result[__Internal__.parseLocaleFileString(parts[0])] = __Internal__.parseLocaleFileString(parts[1]);
														// return result;
													// });
												};
											} else if (variableName && word) {
												if (words) {
													words.push(word);
													if (types.hasKey(section, variableName)) {
														const val = section[variableName];
														if (!types.isArray(val)) {
															section[variableName] = val = [val];
														};
														types.append(val, words);
													} else {
														section[variableName] = words;
													};
												} else {
													if (types.hasKey(section, variableName)) {
														const val = section[variableName];
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
				

				__Internal__.loadLocale = function loadLocaleInternal(rootPath, name, /*optional*/category, /*optional*/sections, /*optional*/translit) {
		//console.log(name);
					const Promise = types.getPromise();
					const filesOptions = files.getOptions();
					rootPath = filesOptions.hooks.pathParser(rootPath);
					const path = rootPath.combine(name);
					return files.readFile(path, {async: true})
						.then(function(data) {
							const loc = __Internal__.parseLocaleFile(rootPath, data, category, sections, translit);
							return loc;
						});
				};
				
				
				localeMake.REGISTER(make.Operation.$extend(
				{
					$TYPE_NAME: 'Database',

					execute: doodad.OVERRIDE(function execute(command, item, /*optional*/options) {
						const Promise = types.getPromise();
						let source = item.source;
						if (types.isString(source)) {
							source = this.taskData.parseVariables(source, { isPath: true });
						};
						let dest = item.destination;
						if (types.isString(dest)) {
							dest = this.taskData.parseVariables(dest, { isPath: true });
						};
						console.info('Compiling locales database (this may take a while)...');
						function proceedItems(items, index) {
							if (index < items.length) {
								const name = items[index];
								console.log("    " + name + " (" + (index + 1) + " of " + items.length + ")");
								return __Internal__.loadLocale(source, name)
									.then(function(loc) {
										return new Promise(function(resolve, reject) {
											try {
												nodeFs.writeFile(dest.combine(name + '.json').toString(), JSON.stringify(loc), {encoding: 'utf-8'}, function(err) {
													if (err) {
														reject(err);
													} else {
														resolve();
													};
												});
											} catch(ex) {
												reject(ex);
											};
										});
									})
									.then(function() {
										return proceedItems(items, index + 1);
									});
							} else {
								// Done
								return Promise.resolve();
							};
						};
						return files.readFile(source.combine('list.txt'), {async: true, encoding: 'utf-8'})
							.then(function(list) {
								const items = list.replace(/(\r\n)|(\n\r)|\n|\r/g, '\n').split('\n').filter(function(name) {return !!name});
								return proceedItems(items, 0);
							});
					}),
				}));
				

				//===================================
				// Init
				//===================================
				//return function init(/*optional*/options) {
				//};
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
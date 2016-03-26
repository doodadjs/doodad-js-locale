//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework
// File: Tools_Locale_Unicode.js - Unicode Tools Extension
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
		DD_MODULES['Doodad.Tools.Locale.Unicode'] = {
			type: null,
			//! INSERT("version:'" + VERSION('doodad-js-locale') + "',")
			namespaces: null,
			dependencies: [
				'Doodad.Tools.Locale',
			],
			
			create: function create(root, /*optional*/_options) {
				"use strict";

				//===================================
				// Get namespaces
				//===================================
					
				var doodad = root.Doodad,
					types = doodad.Types,
					tools = doodad.Tools,
					locale = tools.Locale,
					unicode = tools.Unicode;
					
				//===================================
				// Natives
				//===================================
				
				var __Natives__ = {
					windowRegExp: global.RegExp,
				};
				
				//===================================
				// Internal
				//===================================
					
				//var __Internal__ = {
				//};
				
				
				unicode.isClass = function isClass(className, chr, /*optional*/localeData) {
					if (!localeData) {
						localeData = locale.getCurrent();
					};
					var cls = localeData.LC_CTYPE.classes[className];
					if (!cls && (className === 'alnum')) {
						// NOTE: "alnum" is not in the database.
						return unicode.isClass('digit', chr, localeData) || unicode.isClass('alpha', chr, localeData);
					};
					if (!cls) {
						throw new types.Error("Unknow Unicode class '~0~'.", [className]);
					};
					if (types.isNothing(cls.regExp)) {
						cls.regExp = new __Natives__.windowRegExp(cls.regExpStr);
					};
					return cls.regExp.test(chr);
				};

				unicode.isLower = function isLower(chr, /*optional*/localeData) {
					return unicode.isClass('lower', chr, localeData);
				};
				
				unicode.isUpper = function isUpper(chr, /*optional*/localeData) {
					return unicode.isClass('upper', chr, localeData);
				};
				
				unicode.isAlpha = function isAlpha(chr, /*optional*/localeData) {
					return unicode.isClass('alpha', chr, localeData);
				};
				
				unicode.isDigit = function isDigit(chr, /*optional*/localeData) {
					return unicode.isClass('digit', chr, localeData);
				};
				
				unicode.isAlnum = function isAlnum(chr, /*optional*/localeData) {
					return unicode.isClass('alnum', chr, localeData);
				};
				
				unicode.isHexDigit = function isHexDigit(chr, /*optional*/localeData) {
					return unicode.isClass('xdigit', chr, localeData);
				};
				
				unicode.isPunct = function isPunct(chr, /*optional*/localeData) {
					return unicode.isClass('punct', chr, localeData);
				};
				
				unicode.isSpace = function isSpace(chr, /*optional*/localeData) {
					return unicode.isClass('space', chr, localeData);
				};
				
				unicode.isBlank = function isBlank(chr, /*optional*/localeData) {
					return unicode.isClass('blank', chr, localeData);
				};
				
				unicode.isGraph = function isGraph(chr, /*optional*/localeData) {
					return unicode.isClass('graph', chr, localeData);
				};
				
				unicode.isPrint = function isPrint(chr, /*optional*/localeData) {
					return unicode.isClass('print', chr, localeData);
				};
				
				unicode.isCntrl = function isCntrl(chr, /*optional*/localeData) {
					return unicode.isClass('cntrl', chr, localeData);
				};
				
/*
// TODO: See if Javascript's "toLowerCase" and "toUpperCase" functions are equivalent (has the same mappings)
Function: wint_t towlower (wint_t wc)
Function: wint_t towupper (wint_t wc)

*/

				//===================================
				// Init
				//===================================
				//return function init(/*optional*/options) {
				//};
			},
		};
		
		return DD_MODULES;
	};
	
	if (typeof process !== 'object') {
		// <PRB> export/import are not yet supported in browsers
		global.DD_MODULES = exports.add(global.DD_MODULES);
	};
}).call((typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this));
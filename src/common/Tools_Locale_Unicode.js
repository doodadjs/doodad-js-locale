//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2017 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Tools_Locale_Unicode.js - Unicode Tools Extension
// Project home: https://github.com/doodadjs/
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2015-2017 Claude Petit
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
		DD_MODULES['Doodad.Tools.Locale.Unicode'] = {
			version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
			dependencies: [
				'Doodad.Tools.Locale',
			],
			
			create: function create(root, /*optional*/_options, _shared) {
				"use strict";

				//===================================
				// Get namespaces
				//===================================
					
				const doodad = root.Doodad,
					types = doodad.Types,
					tools = doodad.Tools,
					locale = tools.Locale,
					unicode = tools.Unicode;
					
				//===================================
				// Natives
				//===================================
				
				tools.complete(_shared.Natives, {
					windowRegExp: global.RegExp,
				});
				
				//===================================
				// Internal
				//===================================
					
				//const __Internal__ = {
				//};
				
				
				unicode.ADD('isClass', function isClass(className, chr, /*optional*/localeData) {
					if (!localeData) {
						localeData = locale.getCurrent();
					};
					const cls = localeData.LC_CTYPE.classes[className];
					if (!cls && (className === 'alnum')) {
						// NOTE: "alnum" is not in the database.
						return unicode.isClass('digit', chr, localeData) || unicode.isClass('alpha', chr, localeData);
					};
					if (!cls) {
						throw new types.Error("Unknow Unicode class '~0~'.", [className]);
					};
					if (types.isNothing(cls.regExp)) {
						cls.regExp = new _shared.Natives.windowRegExp("^(" + cls.regExpStr + ")+$");
					};
					return cls.regExp.test(chr);
				});

				unicode.ADD('isLower', function isLower(chr, /*optional*/localeData) {
					return unicode.isClass('lower', chr, localeData);
				});
				
				unicode.ADD('isUpper', function isUpper(chr, /*optional*/localeData) {
					return unicode.isClass('upper', chr, localeData);
				});
				
				unicode.ADD('isAlpha', function isAlpha(chr, /*optional*/localeData) {
					return unicode.isClass('alpha', chr, localeData);
				});
				
				unicode.ADD('isDigit', function isDigit(chr, /*optional*/localeData) {
					return unicode.isClass('digit', chr, localeData);
				});
				
				unicode.ADD('isAlnum', function isAlnum(chr, /*optional*/localeData) {
					return unicode.isClass('alnum', chr, localeData);
				});
				
				unicode.ADD('isHexDigit', function isHexDigit(chr, /*optional*/localeData) {
					return unicode.isClass('xdigit', chr, localeData);
				});
				
				unicode.ADD('isPunct', function isPunct(chr, /*optional*/localeData) {
					return unicode.isClass('punct', chr, localeData);
				});
				
				unicode.ADD('isSpace', function isSpace(chr, /*optional*/localeData) {
					return unicode.isClass('space', chr, localeData);
				});
				
				unicode.ADD('isBlank', function isBlank(chr, /*optional*/localeData) {
					return unicode.isClass('blank', chr, localeData);
				});
				
				unicode.ADD('isGraph', function isGraph(chr, /*optional*/localeData) {
					return unicode.isClass('graph', chr, localeData);
				});
				
				unicode.ADD('isPrint', function isPrint(chr, /*optional*/localeData) {
					return unicode.isClass('print', chr, localeData);
				});
				
				unicode.ADD('isCntrl', function isCntrl(chr, /*optional*/localeData) {
					return unicode.isClass('cntrl', chr, localeData);
				});
				

				//===================================
				// Init
				//===================================
				//return function init(/*optional*/options) {
				//};
			},
		};
		return DD_MODULES;
	},
};
//! END_MODULE()
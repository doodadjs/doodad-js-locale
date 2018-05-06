//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
	// doodad-js - Object-oriented programming framework
	// File: Tools_Locale_Resources.js - Resources manager
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

exports.add = function add(modules) {
	modules = (modules || {});
	modules['Doodad.Tools.Locale.Resources'] = {
		version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
		//dependencies: [],
		create: function create(root, /*optional*/_options, _shared) {
			//===================================
			// Get namespaces
			//===================================

			const doodad = root.Doodad,
				modules = doodad.Modules,
				resources = doodad.Resources,
				types = doodad.Types,
				tools = doodad.Tools,
				files = tools.Files,
				locale = tools.Locale,
				localeResources = locale.Resources;

			return function init(options) {
				const Promise = types.getPromise();
				return Promise.resolve(root.serverSide ? files.Path.parse(module.filename) : modules.locate(/*! INJECT(TO_SOURCE(MANIFEST('name'))) */))
					.then(function(location) {
						location = location.set({file: ''});
						resources.createResourcesLoader(localeResources, (root.serverSide ? location.moveUp(2) : location));
					});
			};
		},
	};
	return modules;
};

//! END_MODULE()

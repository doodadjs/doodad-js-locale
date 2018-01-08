require('@doodad-js/core').createRoot()
	.then(root => {
		return root.Doodad.Modules.load([
			{
				module: '@doodad-js/locale'
			}
		]);
	})
	.then(root => {
		const locale = root.Doodad.Tools.Locale;
		return locale.load('fr_FR');
	}).then(loc => {
		console.log(loc);
	}).catch(err => {
		console.error(err);
	});
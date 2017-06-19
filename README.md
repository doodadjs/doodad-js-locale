Locales provider.

[![NPM Version][npm-image]][npm-url]
 
## Installation

```bash
$ npm install doodad-js-locale
```

## Features

  -  Provides GNU-C's locales data as objects.
  -  Doesn't currently support LC_COLLATE, but it will eventually.
  -  Test a character for an Unicode character class.

## Quick Start

```js
    "use strict";

    const modules = {};
    require('doodad-js-unicode').add(modules);
    require('doodad-js-locale').add(modules);

    require('doodad-js').createRoot(modules).then(root => {
			const locale = root.Doodad.Tools.Locale;
			return locale.load('fr_FR');
		}).then(loc => {
			console.log(loc);
		}).catch(err => {
            console.error(err);
        });
```

## Other available packages

  - **doodad-js-cluster**: Cluster manager (alpha)
  - **doodad-js-dates**: Dates formatting (release)
  - **doodad-js-http**: Http server (alpha)
  - **doodad-js-http_jsonrpc**: JSON-RPC over http server (alpha)
  - **doodad-js-io**: I/O module (alpha)
  - **doodad-js-ipc**: IPC/RPC server (alpha)
  - **doodad-js-loader**: Scripts loader (beta)
  - **doodad-js-make**: Make tools for doodad (alpha)
  - **doodad-js-mime**: Mime types (beta)
  - **doodad-js-minifiers**: Javascript minifier used by doodad (alpha)
  - **doodad-js-server**: Servers base module (alpha)
  - **doodad-js-templates**: HTML page templates (alpha)
  - **doodad-js-terminal**: Terminal (alpha)
  - **doodad-js-test**: Test application
  - **doodad-js-widgets**: Widgets base module (alpha)
  - **doodad-js-xml**: XML Parser (beta)
  
## License

  [Apache-2.0][license-url]

[npm-image]: https://img.shields.io/npm/v/doodad-js-locale.svg
[npm-url]: https://npmjs.org/package/doodad-js-locale
[license-url]: http://opensource.org/licenses/Apache-2.0
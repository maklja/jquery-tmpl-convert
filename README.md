# jquery-tmpl-convert

Application is created to help in migration from deprecated jQuery template library. Application is able to converte jQuery template to handlebar templates. Application supports two working modes: command-line interface(CLI) and server preview for interactive template converting. If needed application can be extended to convert other template types.

## Installing
To install package globally run command:
```
npm install jquery-tmpl-convert -g
```

If you need to use package API install it locally runing command:
```
npm install jquery-tmpl-convert --save
```

## Running application using command-line interface (CLI)

### Without server

To convert source jQuery template files into handlebar templates run command:
```
jquery-tmpl-convert --files <path_to_source_templates> --output <output_directory>
```
where <path_to_source_templates> is glob to source jQuery template files and <output_directory> is directory where converted handlebars files will be copied. The output directory will also contain report.txt file that contains info, warning and error messages for each converted template.

Example:
```
jquery-tmpl-convert --files /my_templates/*.htm --output /converted_tmp/
```
### With server
To run jquery-tmpl-convert application in server mode execute command:

```
jquery-tmpl-convert --files <path_to_source_templates> --server
```
After command executes open browser and enter address http://localhost:3000. UI provides preview of all original and converted templates. Use UI to edit converted templates using double click on any converted template. Templates can be downloaded via "Download" button.
Example:
```
jquery-tmpl-convert --files /my_templates/*.htm --server
```

### CLI arguments
Usage:
```
jquery-tmpl-convert [options]
```
Options:

| Command                      | Short flag       | Description |
| -----------------------------|------------------|-------------|
| --files &lt;globs&gt;        | -f &lt;globs&gt; | input files glob for jquery templates to convert (default: ./*.(html),./*.(htm)) |
| --output [path]              | -o [path]        | output directory for converted files (default: ./results) |
| --server                     | -s               | run application is server mode |
| --port &lt;n&gt;             | -p &lt;n&gt;     | server port (default: 3000) |
| --converter &lt;id&gt;       | -c &lt;id&gt;          | id of the target converter (default: hbs) |
| --extension &lt;extension&gt;| -e &lt;extension&gt;   | ffile extension of converted templates (default: define by chosen converter) |
| --help                       | -h               | output usage information |
| --version                    | -V               | output the version number |

### Using API
If application is installed locally it can be run using API. In order to run application from code follow next example:
```javascript
	const { Application } = require('jquery-tmpl-convert');

	// create application configuration
	const config = {
		// start the application using server mode
		server: true,
		files: ['./**/*.html'],
		output: '',
		port: 3000,
		converter: 'hbs',
		extension: '.hbs'
	};

	const app = new Application(config);
	app.start();
```

## Extend application with custom template converter
Example how to write your custom template converter:
```javascript
	const { Application,
			Converter,
			// helper functions
			Utils,
			// application modes
			Models
	} = require('jquery-tmpl-convert');

	// define custom converter
	class MyCustomConverter extends Converter {
		get id() {
			return 'myCustomConverter';
		}

		get name() {
			return 'My custom converter';
		}

		get fileExtension() {
			return 'htm';
		}

		constructor(cfg) {
			super(cfg);
		}

		convert(templates) {
			// TODO convert jQueryTemplates, see HandlebarsConverter.js for more details

			this._convertTemplates;.push(/* Push template after it is converted */);
		}
	}

	// create application configuration
	const config = {
		// start the application using server mode
		server: true,
		files: ['./**/*.html'],
		output: '',
		port: 3000,
		converter: 'hbs',
		extension: '.hbs'
	};

	const app = new Application(config);
	app.start([new MyCustomConverter()]);
```

## Running the tests
Use command below to run test locally:
```
npm run test
```

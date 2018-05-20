const Application = require('./application/Application');
const HandlebarsConverter = require('./converter/handlerbars/HandlebarsConverter');

const args = process.argv;

// --config parameter is mandatory
if (args.indexOf('--config') === -1) {
	throw new Error('Missing --config parameter with configuration path.');
}

const configPath = args[args.indexOf('--config') + 1];
const useServer = args.indexOf('--noServer') === -1;

// --config parameter is mandatory
if (!configPath) {
	throw new Error('Invalid --config parameter with configuration path.');
}

const converters = [HandlebarsConverter];
const app = new Application(configPath, useServer);
app.start(converters);

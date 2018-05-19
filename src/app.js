const Application = require('./application/Application');

const args = process.argv;

// --config parameter is mandatory
if (args.indexOf('--config') === -1) {
	throw new Error('Missing --config parameter with configuration path.');
}

const configPath = args[args.indexOf('--config') + 1];

// --config parameter is mandatory
if (!configPath) {
	throw new Error('Invalid --config parameter with configuration path.');
}

const app = new Application(configPath);
app.start();

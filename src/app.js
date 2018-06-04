#!/usr/bin/env node

const program = require('commander');
const Application = require('./application/Application');
const npmPackage = require('../package.json');

program
	.version(npmPackage.version)
	.option('-p, --port <n>', 'server port', x => parseInt(x), 3000)
	.option('-s, --server', 'run application is server mode')
	.option(
		'-o, --output [path]',
		'output directory for converted files (default: ./results)',
		'./results'
	)
	.option(
		'-f, --files <globs>',
		'input files pattern for jquery templates to convert',
		val => val.split(',').map(pattern => pattern.trim()),
		['./*.(htm|html)']
	)
	.option('-c, --converter <id>', 'id of the target converter', 'hbs')
	.option(
		'-e, --extension <extension>',
		'file extension of converted templates (default: define by chosen converter)'
	)
	.parse(process.argv);

const config = {
	server: program.server,
	files: program.files,
	output: program.server ? '' : program.output,
	port: program.port,
	converter: program.converter,
	extension: program.extension
};

const app = new Application(config);
app.start();

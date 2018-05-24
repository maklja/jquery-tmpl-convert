const program = require('commander');
const Application = require('./application/Application');
const HandlebarsConverter = require('./converter/handlerbars/HandlebarsConverter');

program
	.version('1.0.0')
	.option('-p, --port <n>', 'Server port', x => parseInt(x), 3000)
	.option(
		'-s, --server',
		'Use server to preview templates insted of command line'
	)
	.option(
		'-o, --output [type]',
		'Command line output dir for converted templates',
		'./results'
	)
	.option(
		'-f, --files <items>',
		'Input files pattern for jquery templates to convert',
		val => val.split(',').map(pattern => pattern.trim()),
		['./*.(htm|html)']
	)
	.option('-c, --converter <id>', 'Id of the target converter')
	.parse(process.argv);

const config = {
	server: program.server,
	files: program.files,
	output: program.output,
	port: program.port,
	converter: program.converter
};

const converters = [HandlebarsConverter];
const app = new Application(config);
app.start(converters);

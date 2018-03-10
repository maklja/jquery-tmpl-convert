const fs = require('fs');
const Parser = require('./parser/Parser');

fs.readFile('src/examples/variable.html', { encoding: 'utf8' }, (err, data) => {
	if (err) {
		// TODO
	}
	var parser = new Parser(data);
	parser.parse();
});

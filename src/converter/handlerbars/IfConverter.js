const AbstractConverter = require('./AbstractConverter');
const { IF } = require('../../tokens/tokens');

class IfConverter extends AbstractConverter {
	constructor(templateConverter) {
		super(templateConverter);
	}

	convert(node) {
		return this._convertDefaultStatement(node, '#if');
	}

	canConvert(node) {
		return node.name === IF;
	}
}

module.exports = IfConverter;

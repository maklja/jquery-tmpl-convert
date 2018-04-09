const AbstractConverter = require('./AbstractConverter');

class IfConverter extends AbstractConverter {
	constructor(templateConverter) {
		super(templateConverter);
	}

	convert(node) {
		return this._convertDefaultStatement(node, '#if');
	}

	canConvert(node) {
		return node.name === 'if';
	}
}

module.exports = IfConverter;

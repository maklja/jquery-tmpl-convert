const AbstractConverter = require('./AbstractConverter');
const { HTML } = require('../../tokens/tokens');

class HTMLConverter extends AbstractConverter {
	constructor(templateConverter) {
		super(templateConverter);
	}

	convert(node) {
		let token = this._convertDefaultStatement(
			node,
			`${node.token.expression.value}`
		);
		token.expression = null;

		return token;
	}

	canConvert(node) {
		return node.name === HTML;
	}
}

module.exports = HTMLConverter;

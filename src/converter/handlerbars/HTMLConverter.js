const AbstractConverter = require('./AbstractConverter');
const { HTML } = require('../../tokens/tokens');

class HTMLConverter extends AbstractConverter {
	convert(node, context, errors) {
		let token = this._convertDefaultStatement(
			node,
			`${node.token.expression.value}`,
			context,
			errors
		);
		token.expression = null;

		return token;
	}

	canConvert(node) {
		return node.name === HTML;
	}
}

module.exports = HTMLConverter;

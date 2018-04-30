const AbstractConverter = require('./AbstractConverter');
const { VAR } = require('../../tokens/tokens');

class ExpressionConverter extends AbstractConverter {
	convert(node, context, errors) {
		return this._convertExpressionToken(node.token, context, errors);
	}

	canConvert(node) {
		return node.name === VAR;
	}
}

module.exports = ExpressionConverter;

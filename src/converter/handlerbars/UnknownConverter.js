const AbstractConverter = require('./AbstractConverter');
const { UNKNOWN } = require('../../tokens/tokens');

class IfConverter extends AbstractConverter {
	convert(node) {
		return node.token.clone();
	}

	canConvert(node) {
		return node.name === UNKNOWN;
	}
}

module.exports = IfConverter;

const AbstractConverter = require('./AbstractConverter');

class ElseConverter extends AbstractConverter {
	constructor(templateConverter) {
		super(templateConverter);
	}

	convert(node) {
		if (node.token.expression != null) {
			return this._convertDefaultStatement(node, 'else if');
		} else {
			return this._convertElseStatement(node);
		}
	}

	canConvert(node) {
		return node.name === 'else';
	}

	_convertElseStatement(node) {
		let elseToken = node.token,
			hbsElseStatement = elseToken.clone();

		return hbsElseStatement;
	}
}

module.exports = ElseConverter;

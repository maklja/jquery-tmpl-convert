const IfElseConverter = require('./IfElseConverter');
const { ELSE } = require('../../tokens/tokens');

class ElseConverter extends IfElseConverter {
	convert(node, context, errors) {
		const expression = node.token.expression;
		// if expression is not null then this is else if statement
		if (expression != null) {
			// check if we have unary negation operator in expression
			// if we have then convert if to unless
			if (this._isUnless(expression)) {
				return this._convertDefaultStatement(
					node,
					'else unless',
					context,
					errors
				);
			} else {
				return this._convertDefaultStatement(
					node,
					'else if',
					context,
					errors
				);
			}
		} else {
			// else withou expresion
			return this._convertElseStatement(node);
		}
	}

	canConvert(node) {
		return node.name === ELSE;
	}

	_convertElseStatement(node) {
		let elseToken = node.token,
			hbsElseStatement = elseToken.clone();

		return hbsElseStatement;
	}
}

module.exports = ElseConverter;

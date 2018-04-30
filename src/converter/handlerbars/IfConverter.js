const IfElseConverter = require('./IfElseConverter');
const { IF } = require('../../tokens/tokens');

class IfConverter extends IfElseConverter {
	convert(node, context, errors) {
		const expression = node.token.expression;
		// if expression is not null then this is else if statement
		if (expression != null) {
			// check if we have unary negation operator in expression
			// if we have then convert if to unless
			if (this._isUnless(expression)) {
				return this._convertDefaultStatement(
					node,
					'#unless',
					context,
					errors
				);
			}
		}

		return this._convertDefaultStatement(node, '#if', context, errors);
	}

	canConvert(node) {
		return node.name === IF;
	}

	getClosingToken(node) {
		const expression = node.token.expression;
		if (expression != null && this._isUnless(expression)) {
			const unlessToken = node.closingToken.clone();
			unlessToken.value = 'unless';
			return unlessToken;
		} else {
			return super.getClosingToken(node);
		}
	}
}

module.exports = IfConverter;

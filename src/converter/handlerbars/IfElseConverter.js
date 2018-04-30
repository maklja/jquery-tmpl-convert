const AbstractConverter = require('./AbstractConverter');
const { extractTokenText } = require('../../parser/parserUtils');

class IfElseConverter extends AbstractConverter {
	_isUnless(expression) {
		return (
			expression.isUnaryExpression() && expression.tree.operator === '!'
		);
	}

	_convertExpressionToken(token, context = {}, errors) {
		if (token == null) {
			return null;
		}

		if (this._isUnless(token)) {
			let expression = token.clone();
			expression.value = extractTokenText(token.tree, {
				// we need to replace $item, $index, $value properties with
				// handlebars one
				replaceFn: tokenName => {
					return this._replaceTokenName(
						tokenName,
						expression,
						context,
						errors
					);
				}
			}).substring(1); // remove '!' from negation

			return expression;
		}

		return super._convertExpressionToken(token, context, errors);
	}
}

module.exports = IfElseConverter;

const {
	CONVERT_CHECK_IS_REQUIRED,
	INVALID_EXPRESSION_TYPE
} = require('../../model/error_code');
const { extractTokenText } = require('../../parser/parserUtils');
const ValidationError = require('../../model/ValidationError');
const { Warning } = require('../../model/ErrorTypes');

class AbstractConverter {
	_convertDefaultStatement(node, convertedValue, context, errors) {
		let expression = node.token.expression,
			hbsStatement = node.token.clone();

		hbsStatement.expression = this._convertExpressionToken(
			expression,
			context,
			errors
		);
		hbsStatement.value = convertedValue;

		return hbsStatement;
	}

	_replaceTokenName(tokenName, expression, context, errors) {
		const { replaceExpression } = context;
		const newTokenName =
			replaceExpression[tokenName] != null
				? replaceExpression[tokenName]
				: tokenName;
		if (tokenName === '$item') {
			errors.push(
				new ValidationError(
					expression.id,
					CONVERT_CHECK_IS_REQUIRED.code,
					CONVERT_CHECK_IS_REQUIRED.message(
						`Replacing $item with ${newTokenName}, check that scope and value are correct.`
					),
					expression.lineNumber,
					Warning
				)
			);
		}

		return newTokenName;
	}

	_convertExpressionToken(
		token,
		context = { replaceExpression: {} },
		errors
	) {
		// if expression is null, just return null
		if (token === null) {
			return null;
		}

		// clone expression
		let expression = token.clone();
		// extract expression value using token tree and replace all jquery template key words
		// with handlebars one
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
		});

		if (!token.isIdentifier() && !token.isMemberExpression()) {
			errors.push(
				new ValidationError(
					expression.id,
					INVALID_EXPRESSION_TYPE.code,
					INVALID_EXPRESSION_TYPE.message(token.treeType),
					expression.lineNumber
				)
			);
		}

		return expression;
	}

	canConvert(node) {
		return false;
	}

	// method is called after node, all its children and siblings are converted
	// we use this to do finish jobs on convertion end
	convertComplited(node) {}

	getClosingToken(node) {
		return node.closingToken != null ? node.closingToken.clone() : null;
	}
}

module.exports = AbstractConverter;

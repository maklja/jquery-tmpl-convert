const AbstractConverter = require('./AbstractConverter');
const { Info } = require('../../model/ErrorTypes');
const ValidationError = require('../../model/ValidationError');
const {
	INVALID_EXPRESSION_TYPE,
	PARTIAL_TEMPLATE_VALID_PARAMS,
	REGISTER_PARTIAL_TEMPLATE,
	WRAP_NODE_CONVERT_NOT_SUPPORTED
} = require('../../model/error_code');
const { WRAP } = require('../../tokens/tokens');

class WrapConverter extends AbstractConverter {
	convert(node, context, errors) {
		let wrapToken = node.token.clone();
		// TODO create new rule??
		wrapToken.pattern.hasClosing = true;

		errors.push(
			new ValidationError(
				wrapToken.id,
				WRAP_NODE_CONVERT_NOT_SUPPORTED.code,
				WRAP_NODE_CONVERT_NOT_SUPPORTED.message(),
				wrapToken.lineNumber
			)
		);

		if (node.token.expression.isLiteral()) {
			let tmplId = this._getPartialTemplateName(wrapToken);

			wrapToken.value = `#> ${tmplId}`;
			if (node.isCallExpression()) {
				let expressionParams = [];
				for (let i = 0; i < wrapToken.parameters.length; i++) {
					expressionParams.push(
						`param${i + 1}=${wrapToken.parameters[i].value}`
					);
				}

				wrapToken.expression.value = expressionParams.join(' ');
				errors.push(
					new ValidationError(
						wrapToken.id,
						PARTIAL_TEMPLATE_VALID_PARAMS.code,
						PARTIAL_TEMPLATE_VALID_PARAMS.message(),
						wrapToken.lineNumber
					)
				);
			} else {
				wrapToken.expression = null;
			}

			errors.push(
				new ValidationError(
					wrapToken.id,
					REGISTER_PARTIAL_TEMPLATE.code,
					REGISTER_PARTIAL_TEMPLATE.message(),
					wrapToken.lineNumber,
					Info
				)
			);
		} else {
			errors.push(
				new ValidationError(
					wrapToken.id,
					INVALID_EXPRESSION_TYPE.code,
					INVALID_EXPRESSION_TYPE.message(
						node.token.expression.treeType
					),
					wrapToken.lineNumber
				)
			);
		}

		return wrapToken;
	}

	canConvert(node) {
		return node.name === WRAP;
	}

	getClosingToken(node) {
		let tmplToken = node.token.clone();
		if (node.token.expression.isLiteral()) {
			let tmplId = this._getPartialTemplateName(tmplToken);

			tmplToken.value = `${tmplId}`;
			tmplToken.expression = null;
			tmplToken.isClosing = true;

			return tmplToken;
		}

		return null;
	}

	_getPartialTemplateName(tmplToken) {
		const exp = tmplToken.expression,
			expValue = exp.value.replace(/"/g, '');

		return expValue[0] === '#' ? expValue.substring(1) : expValue;
	}
}

module.exports = WrapConverter;

const AbstractConverter = require('./AbstractConverter');
const { Info } = require('../../model/ErrorTypes');
const ValidationError = require('../../model/ValidationError');
const {
	REGISTER_PARTIAL_TEMPLATE,
	INVALID_EXPRESSION_TYPE,
	PARTIAL_TEMPLATE_VALID_PARAMS
} = require('../../model/error_code');
const { TMPL } = require('../../tokens/tokens');

class TmplConverter extends AbstractConverter {
	convert(node, context, errors) {
		let tmplToken = node.token.clone();
		// TODO create new rule??
		tmplToken.pattern.hasClosing = true;

		if (node.token.expression.isLiteral()) {
			let tmplId = this._getPartialTemplateName(tmplToken);

			tmplToken.value = `#> ${tmplId}`;
			if (node.isCallExpression()) {
				let expressionParams = [];
				for (let i = 0; i < tmplToken.parameters.length; i++) {
					expressionParams.push(
						`param${i + 1}=${tmplToken.parameters[i].value}`
					);
				}

				tmplToken.expression.value = expressionParams.join(' ');
				errors.push(
					new ValidationError(
						tmplToken.id,
						PARTIAL_TEMPLATE_VALID_PARAMS.code,
						PARTIAL_TEMPLATE_VALID_PARAMS.message(),
						tmplToken.lineNumber
					)
				);
			} else {
				tmplToken.expression = null;
			}

			errors.push(
				new ValidationError(
					tmplToken.id,
					REGISTER_PARTIAL_TEMPLATE.code,
					REGISTER_PARTIAL_TEMPLATE.message(),
					tmplToken.lineNumber,
					Info
				)
			);
		} else {
			errors.push(
				new ValidationError(
					tmplToken.id,
					INVALID_EXPRESSION_TYPE.code,
					INVALID_EXPRESSION_TYPE.message(
						node.token.expression.treeType
					),
					tmplToken.lineNumber
				)
			);
		}

		return tmplToken;
	}

	canConvert(node) {
		return node.name === TMPL;
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

module.exports = TmplConverter;

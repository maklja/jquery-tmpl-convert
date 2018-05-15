const AbstractConverter = require('./AbstractConverter');
const { Info } = require('../../model/ErrorTypes');
const ValidationError = require('../../model/ValidationError');
const { CONVERT_ERROR } = require('../../model/error_code');
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
						CONVERT_ERROR.code,
						CONVERT_ERROR.message(
							`Pass valid parameters to partial template.`
						),
						tmplToken.lineNumber
					)
				);
			} else {
				tmplToken.expression = null;
			}

			errors.push(
				new ValidationError(
					tmplToken.id,
					CONVERT_ERROR.code,
					CONVERT_ERROR.message(
						`Make sure that partial template is register to handlebars.`
					),
					tmplToken.lineNumber,
					Info
				)
			);
		} else {
			errors.push(
				new ValidationError(
					tmplToken.id,
					CONVERT_ERROR.code,
					CONVERT_ERROR.message(
						`Template tag expression must be literal.`
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
		let exp = tmplToken.expression,
			expValue = exp.value.replace(/"/g, '');

		return expValue[0] === '#' ? expValue.substring(1) : expValue;
	}
}

module.exports = TmplConverter;

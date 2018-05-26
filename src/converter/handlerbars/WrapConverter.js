const AbstractConverter = require('./AbstractConverter');
const { Info } = require('../../model/ErrorTypes');
const ValidationError = require('../../model/ValidationError');
const { CONVERT_ERROR } = require('../../model/error_code');
const { WRAP } = require('../../tokens/tokens');

class WrapConverter extends AbstractConverter {
	convert(node, context, errors) {
		let wrapToken = node.token.clone();
		// TODO create new rule??
		wrapToken.pattern.hasClosing = true;

		errors.push(
			new ValidationError(
				wrapToken.id,
				CONVERT_ERROR.code,
				CONVERT_ERROR.message(
					'Converting WRAP node is not supported. Create partial template with @partial-block, see http://handlebarsjs.com/partials.html.'
				),
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
						CONVERT_ERROR.code,
						CONVERT_ERROR.message(
							'Pass valid parameters to partial template.'
						),
						wrapToken.lineNumber
					)
				);
			} else {
				wrapToken.expression = null;
			}

			errors.push(
				new ValidationError(
					wrapToken.id,
					CONVERT_ERROR.code,
					CONVERT_ERROR.message(
						'Make sure that partial template is register to handlebars. See http://handlebarsjs.com/partials.html'
					),
					wrapToken.lineNumber,
					Info
				)
			);
		} else {
			errors.push(
				new ValidationError(
					wrapToken.id,
					CONVERT_ERROR.code,
					CONVERT_ERROR.message(
						'Template wrap expression must be literal.'
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

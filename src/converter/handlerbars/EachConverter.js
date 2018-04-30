const AbstractConverter = require('./AbstractConverter');
const { EACH } = require('../../tokens/tokens');
const { Warning } = require('../../model/ErrorTypes');
const ValidationError = require('../../model/ValidationError');
const { CONVERT_ERROR } = require('../../model/error_code');

class EachConverter extends AbstractConverter {
	constructor() {
		super();

		this.EACH_INDEX = '$index';
		this.EACH_VALUE = '$value';

		this._eachStatementParms = [];
	}

	convert(node, context, errors) {
		let convEachStatement = null;

		// check if each has custom index and value names
		if (node.isCallExpression()) {
			const params = node.token.parameters;

			convEachStatement = this._convertDefaultStatement(
				node,
				'#each',
				context,
				errors
			);

			// handlebars doesn't support more then 2 named parameters in each function
			// only two parameters are value and index, or key if context is object and
			// not an array
			if (params.length > 2) {
				errors.push(
					new ValidationError(
						convEachStatement.id,
						CONVERT_ERROR.code,
						CONVERT_ERROR.message(
							`Handlebars support only 2 parameters in each function.`
						),
						convEachStatement.lineNumber
					)
				);
			}

			// add named parameters in each statement
			convEachStatement.expression.value += ` as |${params
				.map(curParam => curParam.value)
				// handlebars first has value and then index or key
				.reverse()
				.join(' ')}|`;

			// user need to check if named parameters are correct
			errors.push(
				new ValidationError(
					convEachStatement.id,
					CONVERT_ERROR.code,
					CONVERT_ERROR.message(
						`Check named parameters in each function`
					),
					convEachStatement.lineNumber,
					Warning
				)
			);
		} else {
			const indexParam = this.EACH_INDEX,
				valueParam = this.EACH_VALUE;

			// simple each case without custom index and value name
			convEachStatement = this._convertDefaultStatement(
				node,
				'#each',
				context,
				errors
			);
			this._eachStatementParms.push({
				index: indexParam,
				value: valueParam
			});

			errors.push(
				new ValidationError(
					convEachStatement.id,
					CONVERT_ERROR.code,
					CONVERT_ERROR.message(
						`Check if @index is correct or @key needs to go if expresion value is object and not an array.`
					),
					convEachStatement.lineNumber,
					Warning
				)
			);
		}

		this._replaceExpression(context.replaceExpression);
		return convEachStatement;
	}

	canConvert(node) {
		return node.name === EACH;
	}

	_replaceExpression(replace) {
		if (this._eachStatementParms.length > 0) {
			// reverse array because items at the end of the array have priority
			for (let curEachParams of this._eachStatementParms.reverse()) {
				replace[curEachParams.index] = '@index';
				replace[curEachParams.value] = 'this';
			}
		}
	}

	convertComplited(node, context) {
		if (node.name === EACH) {
			// each statement is closed remove index and value parameters
			this._eachStatementParms.pop();

			delete context.replaceExpression[this.EACH_INDEX];
			delete context.replaceExpression[this.EACH_VALUE];

			this._replaceExpression(context.replaceExpression);
		}
	}
}

module.exports = EachConverter;

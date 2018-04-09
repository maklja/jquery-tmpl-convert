const AbstractConverter = require('./AbstractConverter');
const { EACH } = require('../../tokens/tokens');

class EachConverter extends AbstractConverter {
	constructor(templateConverter) {
		super(templateConverter);

		this.EACH_INDEX = '$index';
		this.EACH_VALUE = '$value';

		this._eachStatementParms = [];
	}

	convert(node, context) {
		let convEachStatement = null,
			indexParam = this.EACH_INDEX,
			valueParam = this.EACH_VALUE;

		// check if each has custom index and value names
		if (node.isCallExpression()) {
			let params = node.token.parameters;

			if (params[0]) {
				indexParam = params[0].value;
			}

			if (params[1]) {
				valueParam = params[1].value;
			}

			convEachStatement = this._convertDefaultStatement(node, '#each');
			this._eachStatementParms.push({
				index: indexParam,
				value: valueParam
			});
		} else {
			// simple each case without custom index and value name
			convEachStatement = this._convertDefaultStatement(node, '#each');
			this._eachStatementParms.push({
				index: indexParam,
				value: valueParam
			});
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

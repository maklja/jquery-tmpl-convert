class AbstractConverter {
	constructor(templateConverter) {
		this.tmplConverter = templateConverter;
	}

	_convertDefaultStatement(node, convertedValue) {
		let expression = node.token.expression,
			hbsStatement = node.token.clone();

		hbsStatement.expression =
			expression != null
				? this.tmplConverter.convertExpressionToken(expression)
				: expression;
		hbsStatement.value = convertedValue;

		return hbsStatement;
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

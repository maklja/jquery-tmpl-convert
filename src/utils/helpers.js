const Unknown = require('../model/Unknown');
const Statement = require('../model/Statement');
const Expression = require('../model/Expression');

const isExpression = token => token instanceof Expression;
const isStatement = token => token instanceof Statement;
const isUnknown = token => token instanceof Unknown;

// const jQueryTemplateValue = token => {
// 	if (isStatement(token)) {
// 		let closing = token.isClosing ? '/' : '',
// 			expression = token.expression ? ` ${token.expression.value}` : '';
// 		return `{{${closing}${token.value}${expression}}}`;
// 	} else if (isExpression(token)) {
// 		return `\${${token.value}}`;
// 	} else if (isUnknown(token)) {
// 		return token.value;
// 	} else {
// 		// TODO
// 	}
// };

const hbsTokenValue = token => {
	if (isStatement(token)) {
		let closing = token.isClosing ? '/' : '',
			expression = token.expression ? ` ${token.expression.value}` : '';
		return `{{${closing}${token.value}${expression}}}`;
	} else if (isExpression(token)) {
		return `{{${token.value}}}`;
	} else if (isUnknown(token)) {
		return token.value;
	} else {
		throw new Error(`Unknown token type ${token.treeType}`);
	}
};

const hbsTemplateValue = tokens => {
	let value = '';
	for (let curToken of tokens) {
		value += hbsTokenValue(curToken);
	}

	return value;
};

module.exports = {
	isExpression,
	isStatement,
	isUnknown,
	hbsTemplateValue
};

const Unknown = require('../model/Unknown');
const Statement = require('../model/Statement');
const Expression = require('../model/Expression');

const isExpression = token => token instanceof Expression;
const isStatement = token => token instanceof Statement;
const isUnknown = token => token instanceof Unknown;

module.exports = {
	isExpression,
	isStatement,
	isUnknown
};

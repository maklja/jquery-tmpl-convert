const UNKNOWN = 'unknown';
const VAR = 'var';
const IF = 'if';
const ELSE = 'else';
const HTML = 'html';
const EACH = 'each';
const WRAP = 'wrap';
const TMPL = 'tmpl';

const CLOSING_RULE = {
	hasClosing: false,
	hasExpression: false,
	expressionMandatory: false,
	afterTokens: null
};

const IF_RULE = {
	name: IF,
	hasClosing: true,
	hasExpression: true,
	expressionMandatory: true,
	afterTokens: null
};

const IF_CLOSE_RULE = Object.assign(
	{
		name: IF
	},
	CLOSING_RULE
);

const EACH_RULE = {
	name: EACH,
	hasClosing: true,
	hasExpression: true,
	expressionMandatory: true,
	afterTokens: null
};

const EACH_CLOSE_RULE = Object.assign(
	{
		name: EACH
	},
	CLOSING_RULE
);

const WRAP_RULE = {
	name: WRAP,
	hasClosing: true,
	hasExpression: true,
	expressionMandatory: true,
	afterTokens: null
};

const WRAP_CLOSE_RULE = Object.assign(
	{
		name: WRAP
	},
	CLOSING_RULE
);

const TMPL_RULE = {
	name: TMPL,
	hasClosing: false,
	hasExpression: true,
	expressionMandatory: true,
	afterTokens: null
};

const HTML_RULE = {
	name: HTML,
	hasClosing: false,
	hasExpression: true,
	expressionMandatory: true,
	afterTokens: null
};

const ELSE_RULE = {
	name: ELSE,
	hasClosing: false,
	hasExpression: true,
	expressionMandatory: false,
	afterTokens: [IF, ELSE]
};

const tokenPatterns = {
	identifier: [
		IF_RULE,
		EACH_RULE,
		WRAP_RULE,
		TMPL_RULE,
		HTML_RULE,
		ELSE_RULE
	],
	callExpression: [IF_RULE, EACH_RULE, TMPL_RULE, WRAP_RULE]
};

const tokenClosePatterns = {
	identifier: [IF_CLOSE_RULE, EACH_CLOSE_RULE, WRAP_CLOSE_RULE],
	callExpression: [IF_CLOSE_RULE, EACH_CLOSE_RULE, WRAP_CLOSE_RULE]
};

const findStatementTokenPatternByName = (tokenName, isClosingToken = false) => {
	if (isClosingToken) {
		return [IF_CLOSE_RULE, EACH_CLOSE_RULE, WRAP_CLOSE_RULE].find(
			curTokenRule => curTokenRule.name === tokenName
		);
	} else {
		return [
			IF_RULE,
			EACH_RULE,
			WRAP_RULE,
			TMPL_RULE,
			HTML_RULE,
			ELSE_RULE
		].find(curTokenRule => curTokenRule.name === tokenName);
	}
};

module.exports = {
	VAR,
	UNKNOWN,
	IF,
	ELSE,
	HTML,
	EACH,
	WRAP,
	TMPL,
	tokenPatterns,
	tokenClosePatterns,
	findStatementTokenPatternByName
};

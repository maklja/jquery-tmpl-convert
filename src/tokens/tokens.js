const {
	isIdentifier,
	isCallExpression
} = require('../parser/token_parsers/tokenParser');

const UNKNOWN = {
	name: 'unknown'
};

const PARAM = {
	name: 'param'
};

const VAR = {
	name: 'var'
};

const IF = {
	name: 'if'
};

const ELSE = {
	name: 'else'
};

const HTML = {
	name: 'html'
};

const EACH = {
	name: 'each'
};

const WRAP = {
	name: 'wrap'
};

const TMPL = {
	name: 'tmpl'
};

const CLOSING_RULE = {
	hasClosing: false,
	hasExpression: false,
	expressionMandatory: false,
	afterTokens: null
};

const IF_RULE = {
	name: IF.name,
	hasClosing: true,
	hasExpression: true,
	expressionMandatory: true,
	afterTokens: null
};

const IF_CLOSE_RULE = Object.assign(
	{
		name: IF.name
	},
	CLOSING_RULE
);

const EACH_RULE = {
	name: EACH.name,
	hasClosing: true,
	hasExpression: true,
	expressionMandatory: true,
	afterTokens: null
};

const EACH_CLOSE_RULE = Object.assign(
	{
		name: EACH.name
	},
	CLOSING_RULE
);

const WRAP_RULE = {
	name: WRAP.name,
	hasClosing: true,
	hasExpression: true,
	expressionMandatory: true,
	afterTokens: null
};

const WRAP_CLOSE_RULE = Object.assign(
	{
		name: WRAP.name
	},
	CLOSING_RULE
);

const TMPL_RULE = {
	name: TMPL.name,
	hasClosing: false,
	hasExpression: true,
	expressionMandatory: true,
	afterTokens: null
};

const HTML_RULE = {
	name: HTML.name,
	hasClosing: false,
	hasExpression: true,
	expressionMandatory: true,
	afterTokens: null
};

const ELSE_RULE = {
	name: ELSE.name,
	hasClosing: false,
	hasExpression: true,
	expressionMandatory: false,
	afterTokens: [IF.name, ELSE.name]
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
	callExpression: [EACH_RULE, TMPL_RULE, WRAP_RULE]
};

const tokenClosePatterns = {
	identifier: [IF_CLOSE_RULE, EACH_CLOSE_RULE, WRAP_CLOSE_RULE],
	callExpression: [EACH_CLOSE_RULE, WRAP_CLOSE_RULE]
};

const findStatementTokenPattern = (statementTree, isClosingToken) => {
	let patternTypes = null,
		statementName = null;

	if (isIdentifier(statementTree)) {
		patternTypes = isClosingToken
			? tokenClosePatterns.identifier
			: tokenPatterns.identifier;
		statementName = statementTree.name;
	} else if (isCallExpression(statementTree)) {
		patternTypes = isClosingToken
			? tokenClosePatterns.callExpression
			: tokenPatterns.callExpression;
		statementName = statementTree.callee.name;
	} else {
		return null;
	}

	return patternTypes.find(
		curTokenPattern =>
			// if pattern name and statment token name are same
			curTokenPattern.name === statementName
	);
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
	PARAM,
	IF,
	ELSE,
	HTML,
	EACH,
	WRAP,
	TMPL,
	findStatementTokenPattern,
	findStatementTokenPatternByName
};

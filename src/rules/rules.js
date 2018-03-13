const tokens = require('../../src/tokens/tokens');

const VAR_RULE = {
	ruleFor: [tokens.VAR],
	closeToken: null,
	afterTokens: null
};

const IF_RULE = {
	ruleFor: [tokens.IF_START],
	closeToken: tokens.IF_END,
	afterTokens: null
	// statementMandatory: true,
	// canHaveStatement: true,
	// closeToken: tokens.IF_END.name,
};

const EACH_RULE = {
	ruleFor: [tokens.EACH_START],
	closeToken: tokens.EACH_END,
	afterTokens: null
};

const END_TAG_RULE = {
	ruleFor: [tokens.IF_END, tokens.EACH_END, tokens.WRAP_END],
	closeToken: null,
	afterTokens: null
};

const ELSE_RULE = {
	ruleFor: [tokens.ELSE],
	closeToken: null,
	afterTokens: [tokens.IF_START, tokens.ELSE_IF]
};

const ELSE_IF_RULE = {
	ruleFor: [tokens.ELSE_IF],
	closeToken: null,
	afterTokens: [tokens.IF_START, tokens.ELSE_IF]
};

const HTML_RULE = {
	ruleFor: [tokens.HTML],
	closeToken: null,
	afterTokens: null
};

const WRAP_RULE = {
	ruleFor: [tokens.WRAP_START],
	closeToken: tokens.WRAP_END,
	afterTokens: null
};

const TMPL_RULE = {
	ruleFor: [tokens.TMPL],
	canHaveStatement: true,
	statementMandatory: true,
	closeToken: null,
	afterTokens: null,
	isClosingTag: false
};

module.exports = {
	rules: [
		VAR_RULE,
		IF_RULE,
		END_TAG_RULE,
		EACH_RULE,
		HTML_RULE,
		ELSE_RULE,
		ELSE_IF_RULE,
		WRAP_RULE,
		TMPL_RULE
	]
};

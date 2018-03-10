const tokens = require('../../src/tokens/tokens');

const VAR_RULE = {
	statementMandatory: true,
	closeTag: null,
	afterTags: null
};

const IF_RULE = {
	statementMandatory: true,
	closeTag: tokens.IF_END.name,
	afterTags: null
};

const ELSE_RULE = {
	statementMandatory: false,
	closeTag: null,
	afterTags: [tokens.IF_START.name, tokens.ELSE_IF.name]
};

const ELSE_IF_RULE = {
	statementMandatory: true,
	closeTag: null,
	afterTags: [tokens.IF_START.name, tokens.ELSE_IF.name]
};

const EACH_RULE = {
	statementMandatory: true,
	closeTag: tokens.EACH_START.name,
	afterTags: null
};

const HTML_RULE = {
	statementMandatory: true,
	closeTag: null,
	afterTags: null
};

const WRAP_RULE = {
	statementMandatory: true,
	closeTag: tokens.WRAP_END.name,
	afterTags: null
};

const TMPL_RULE = {
	statementMandatory: true,
	closeTag: null,
	afterTags: null
};

module.exports = {
	rules: [
		VAR_RULE,
		IF_RULE,
		EACH_RULE,
		HTML_RULE,
		ELSE_RULE,
		ELSE_IF_RULE,
		WRAP_RULE,
		TMPL_RULE
	]
};

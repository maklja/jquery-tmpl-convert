const tokens = require('../../src/tokens/tokens');

const VAR_RULE = {
	ruleFor: [tokens.VAR],
	closeToken: null,
	afterTokens: null,
	hasStatement: true
};

const IF_RULE = {
	ruleFor: [tokens.IF_START],
	closeToken: tokens.IF_END,
	afterTokens: null,
	hasStatement: true
};

const EACH_RULE = {
	ruleFor: [tokens.EACH_START],
	closeToken: tokens.EACH_END,
	afterTokens: null,
	hasStatement: true
};

const END_TAG_RULE = {
	ruleFor: [tokens.IF_END, tokens.EACH_END, tokens.WRAP_END],
	closeToken: null,
	afterTokens: null,
	hasStatement: false,
	isCloseToken: true
};

const ELSE_RULE = {
	ruleFor: [tokens.ELSE],
	closeToken: null,
	afterTokens: [tokens.IF_START, tokens.ELSE_IF],
	hasStatement: false
};

const ELSE_IF_RULE = {
	ruleFor: [tokens.ELSE_IF],
	closeToken: null,
	afterTokens: [tokens.IF_START, tokens.ELSE_IF],
	hasStatement: true
};

const HTML_RULE = {
	ruleFor: [tokens.HTML],
	closeToken: null,
	afterTokens: null,
	hasStatement: true
};

const WRAP_RULE = {
	ruleFor: [tokens.WRAP_START],
	closeToken: tokens.WRAP_END,
	afterTokens: null,
	hasStatement: true
};

const TMPL_RULE = {
	ruleFor: [tokens.TMPL],
	closeToken: null,
	afterTokens: null,
	hasStatement: true
};

const rules = [
	VAR_RULE,
	IF_RULE,
	END_TAG_RULE,
	EACH_RULE,
	HTML_RULE,
	ELSE_RULE,
	ELSE_IF_RULE,
	WRAP_RULE,
	TMPL_RULE
];

module.exports = {
	rules,
	findRule(token) {
		for (let curRule of rules) {
			let tokenRule = curRule.ruleFor.find(curToken => {
				return curToken.name === token.name;
			});

			if (tokenRule != null) {
				return curRule;
			}
		}

		return null;
	}
};

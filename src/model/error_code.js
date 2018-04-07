const EXPRESSION_MISSING = {
	message(token) {
		return `Expression is mandatory for token type ${token.name}`;
	},
	code: 101
};

const UNEXPECTED_EXPRESSION = {
	message(token) {
		return `Token type ${token.name} can't have expression`;
	},
	code: 102
};

const MISSING_CLOSING_TOKEN = {
	message(token) {
		return `Token type ${token.name} missing closing type`;
	},
	code: 103
};

const MISSING_STARTING_TOKEN = {
	message(token) {
		return `Token type ${token.name} missing starting type`;
	},
	code: 104
};

const MISSING_SIBLING_TOKEN = {
	message(token, afterToken) {
		return `Token type ${token.name} must go after ${afterToken}`;
	},
	code: 105
};

const PARSE_ERROR = {
	message(msg) {
		return `Parse failed: ${msg}`;
	},
	code: 106
};

const CONVERT_ERROR = {
	message(msg) {
		return `Convert failed: ${msg}`;
	},
	code: 107
};

module.exports = {
	EXPRESSION_MISSING,
	UNEXPECTED_EXPRESSION,
	MISSING_CLOSING_TOKEN,
	MISSING_STARTING_TOKEN,
	MISSING_SIBLING_TOKEN,
	PARSE_ERROR,
	CONVERT_ERROR
};

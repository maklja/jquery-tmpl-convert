const STATMENT_MISSING = {
	message(token) {
		return `Statement is mandatory for token type ${token.name}`;
	},
	code: 101
};

const UNEXPECTED_STATMENT = {
	message(token) {
		return `Token type ${token.name} can't have statement`;
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

module.exports = {
	STATMENT_MISSING,
	UNEXPECTED_STATMENT,
	MISSING_CLOSING_TOKEN,
	MISSING_STARTING_TOKEN,
	MISSING_SIBLING_TOKEN
};

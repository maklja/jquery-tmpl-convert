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
		return `Convert: ${msg}`;
	},
	code: 107
};

const CONVERT_CHECK_IS_REQUIRED = {
	message(msg) {
		return `Convert: ${msg}`;
	},
	code: 201
};

const INVALID_EXPRESSION_TYPE = {
	message(type) {
		return `Convert: Expression can't be type of ${type}.`;
	},
	code: 202
};

const INVALID_PARAMETERS_NUMBER = {
	message(n, name) {
		return `Convert: Invalid parameters number, expected ${n} parameters in ${name}`;
	},
	code: 203
};

const PARTIAL_TEMPLATE_VALID_PARAMS = {
	message(n, name) {
		return 'Convert: Pass valid parameters to partial template.';
	},
	code: 204
};

const REGISTER_PARTIAL_TEMPLATE = {
	message() {
		return 'Convert: Make sure that partial template is register to handlebars. See http://handlebarsjs.com/partials.html';
	},
	code: 205
};

const WRAP_NODE_CONVERT_NOT_SUPPORTED = {
	message() {
		return 'Convert: Converting WRAP node is not supported. Create partial template with @partial-block, see http://handlebarsjs.com/partials.html.';
	},
	code: 206
};

module.exports = {
	EXPRESSION_MISSING,
	UNEXPECTED_EXPRESSION,
	MISSING_CLOSING_TOKEN,
	MISSING_STARTING_TOKEN,
	MISSING_SIBLING_TOKEN,
	PARSE_ERROR,
	CONVERT_ERROR,
	CONVERT_CHECK_IS_REQUIRED,
	INVALID_EXPRESSION_TYPE,
	INVALID_PARAMETERS_NUMBER,
	PARTIAL_TEMPLATE_VALID_PARAMS,
	REGISTER_PARTIAL_TEMPLATE,
	WRAP_NODE_CONVERT_NOT_SUPPORTED
};

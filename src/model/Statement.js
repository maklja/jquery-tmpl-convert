const Token = require('./Token');

module.exports = class Statement extends Token {
	get expression() {
		return this._expression;
	}

	get isClosing() {
		return this._isClosing;
	}

	get parameters() {
		return this._parameters;
	}

	get pattern() {
		return this._pattern;
	}

	constructor(
		name,
		value,
		tree,
		expression,
		isClosingToken,
		params,
		pattern
	) {
		super(name, value, tree);
		this._expression = expression;
		this._isClosing = isClosingToken;
		this._parameters = params;
		this._pattern = pattern;
	}
};

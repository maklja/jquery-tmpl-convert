const Token = require('./Token');

module.exports = class Statement extends Token {
	get expression() {
		return this._expression;
	}

	set expression(expression) {
		this._expression = expression;
	}

	get isClosing() {
		return this._isClosing;
	}

	set isClosing(isClosing) {
		this._isClosing = isClosing;
	}

	get parameters() {
		return this._parameters;
	}

	get pattern() {
		return this._pattern;
	}

	get lineNumber() {
		return super.lineNumber;
	}

	// override line number to set line number to expression
	set lineNumber(lineNumber) {
		this._lineNumber = lineNumber;

		if (this._expression) {
			this._expression.lineNumber = lineNumber;
		}
	}

	constructor(
		name,
		value,
		tree,
		expression,
		isClosingToken,
		params,
		pattern,
		lineNumber
	) {
		super(name, value, tree, lineNumber);
		this._expression = expression;
		this._isClosing = isClosingToken;
		this._parameters = params;
		this._pattern = pattern;
	}

	clone() {
		let expression =
				this._expression != null ? this._expression.clone() : null,
			params = null;

		if (this._parameters != null) {
			params = [];
			for (let curParam of this._parameters) {
				params.push(curParam.clone());
			}
		}

		return new Statement(
			this._name,
			this._value,
			null,
			expression,
			this._isClosing,
			params,
			Object.assign({}, this._pattern),
			this._lineNumber.slice()
		);
	}

	toJSON() {
		let json = super.toJSON(),
			expression =
				this.expression != null ? this.expression.toJSON() : null,
			{ isClosing } = this,
			parameters = this.parameters.map(curParam => curParam.toJSON());

		return Object.assign(json, { expression, isClosing, parameters });
	}
};

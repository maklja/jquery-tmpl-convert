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
			Object.assign({}, this._pattern)
		);
	}

	toJSON() {
		let json = super.toJSON(),
			expression = this.expression.toJSON(),
			{ isClosing } = this,
			parameters = this.parameters.map(curParam => curParam.toJSON());

		return Object.assign(json, { expression, isClosing, parameters });
	}
};

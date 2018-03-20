module.exports = class Expression {
	get value() {
		return this._value;
	}

	get tree() {
		return this._tree;
	}

	constructor(expressionValue, tree) {
		this._value = expressionValue;
		this._tree = tree;
	}
};

const {
	isCompound,
	isIdentifier,
	isBinaryExpression,
	isLiteral,
	isMemberExpression,
	isCallExpression
} = require('../parser/parserUtils');

class Token {
	get name() {
		return this._name;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		this._value = value;
	}

	get tree() {
		return this._tree;
	}

	get treeType() {
		return this._tree.type;
	}

	isCompound() {
		return isCompound(this._tree);
	}

	isIdentifier() {
		return isIdentifier(this._tree);
	}

	isBinaryExpression() {
		return isBinaryExpression(this._tree);
	}

	isLiteral() {
		return isLiteral(this._tree);
	}

	isMemberExpression() {
		return isMemberExpression(this._tree);
	}

	isCallExpression() {
		return isCallExpression(this._tree);
	}

	constructor(name, value, tree) {
		this._name = name;
		this._value = value;
		this._tree = tree;
	}
}

module.exports = Token;

const uuidv1 = require('uuid/v1');
const {
	isCompound,
	isIdentifier,
	isBinaryExpression,
	isLiteral,
	isMemberExpression,
	isCallExpression,
	isUnaryExpression,
	isLogicalExpression
} = require('../parser/parserUtils');

class Token {
	get id() {
		return this._id;
	}

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

	get lineNumber() {
		return this._lineNumber;
	}

	set lineNumber(lineNumber) {
		this._lineNumber = lineNumber;
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

	isUnaryExpression() {
		return isUnaryExpression(this._tree);
	}

	isLogicalExpression() {
		return isLogicalExpression(this._tree);
	}

	constructor(name, value, tree, lineNumber = []) {
		this._id = uuidv1();
		this._name = name;
		this._value = value;
		this._tree = tree;
		this._lineNumber = lineNumber;
	}

	toJSON() {
		let { id, name, value, lineNumber } = this;

		return { id, name, value, lineNumber };
	}
}

module.exports = Token;

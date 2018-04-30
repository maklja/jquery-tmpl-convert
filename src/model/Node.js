const Statement = require('./Statement');
const Expression = require('./Expression');
const Unknown = require('./Unknown');

module.exports = class Node {
	get children() {
		return this._children;
	}

	get siblings() {
		return this._siblings;
	}

	get token() {
		return this._token;
	}

	get closingToken() {
		return this._closingToken;
	}

	set closingToken(closingToken) {
		this._closingToken = closingToken;
	}

	get name() {
		return this._token.name;
	}

	isExpression() {
		return this._token instanceof Expression;
	}

	isStatement() {
		return this._token instanceof Statement;
	}

	isUnknown() {
		return this._token instanceof Unknown;
	}

	isCompound() {
		return this._token.isCompound();
	}

	isIdentifier() {
		return this._token.isIdentifier();
	}

	isBinaryExpression() {
		return this._token.isBinaryExpression();
	}

	isLiteral() {
		return this._token.isLiteral();
	}

	isMemberExpression() {
		return this._token.isMemberExpression();
	}

	isCallExpression() {
		return this._token.isCallExpression();
	}

	isUnaryExpression() {
		return this._token.isUnaryExpression();
	}

	constructor(token) {
		this._children = [];
		this._token = token;
		this._siblings = [];
	}

	toJSON() {
		let token = this.token.toJSON(),
			closingToken = this.token.toJSON(),
			children = this.children.map(curChild => curChild.toJSON()),
			siblings = this.siblings.map(curSibling => curSibling.toJSON()),
			{ name } = this;

		return { token, closingToken, children, siblings, name };
	}
};

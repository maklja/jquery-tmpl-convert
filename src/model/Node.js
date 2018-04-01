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

	constructor(token) {
		this._children = [];
		this._token = token;
		this._siblings = [];
	}
};

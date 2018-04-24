const Token = require('./Token');
const { VAR } = require('../tokens/tokens');

module.exports = class Expression extends Token {
	constructor(value, tree, lineNumber) {
		super(VAR, value, tree, lineNumber);
	}

	clone() {
		return new Expression(this.value, null, this._lineNumber.slice());
	}
};

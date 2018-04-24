const Token = require('./Token');
const { UNKNOWN } = require('../tokens/tokens');

module.exports = class Unknown extends Token {
	constructor(value, lineNumber) {
		super(UNKNOWN, value, null, lineNumber);
	}

	clone() {
		return new Unknown(this.value, this._lineNumber.slice());
	}
};

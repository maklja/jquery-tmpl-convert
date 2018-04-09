const Token = require('./Token');
const { UNKNOWN } = require('../tokens/tokens');

module.exports = class Unknown extends Token {
	constructor(value) {
		super(UNKNOWN, value, null);
	}

	clone() {
		return new Unknown(this.value);
	}
};

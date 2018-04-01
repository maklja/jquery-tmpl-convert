const Token = require('./Token');
const { UNKNOWN } = require('../tokens/tokens');

module.exports = class Unknown extends Token {
	constructor(value, position) {
		super(UNKNOWN, value, null, position);
	}
};

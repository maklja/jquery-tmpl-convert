const Token = require('./Token');
const { VAR } = require('../tokens/tokens');

module.exports = class Expression extends Token {
	constructor(value, tree) {
		super(VAR, value, tree);
	}
};

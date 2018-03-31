const Token = require('./Token');
const { VAR } = require('../tokens/tokens');

module.exports = class Expression extends Token {
	constructor(value, tree, position) {
		super(VAR.name, value, tree, position);
	}
};

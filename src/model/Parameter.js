const Token = require('./Token');
const { PARAM } = require('../tokens/tokens');

module.exports = class Parameter extends Token {
	constructor(value, tree) {
		super(PARAM, value, tree);
	}
};

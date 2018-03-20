const chai = require('chai');

const expect = chai.expect;
const { compareTokenState } = require('../utils/utils');
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');

describe('parse VAR token', () => {
	it('startPosition 0, endPosition 7 and name is var', () => {
		// eslint-disable-next-line
		const template = '${test}';
		const parser = new Parser(template);
		parser.parse();

		expect(parser.tokens)
			.to.be.an('array')
			.that.have.lengthOf(1);

		let token = parser.tokens[0];
		compareTokenState(token, 0, 7, tokens.VAR.name, 'test');
	});

	it('variable for statement', () => {
		// eslint-disable-next-line
		const template = '${test}';
		const parser = new Parser(template);
		parser.parse();

		expect(parser.tokens)
			.to.be.an('array')
			.that.have.lengthOf(1);

		let token = parser.tokens[0];
		compareTokenState(token, 0, 7, tokens.VAR.name, 'test');
	});

	it('object property for statement', () => {
		// eslint-disable-next-line
		const template = '${test.length}';
		const parser = new Parser(template);
		parser.parse();

		expect(parser.tokens)
			.to.be.an('array')
			.that.have.lengthOf(1);

		let token = parser.tokens[0];
		compareTokenState(token, 0, 14, tokens.VAR.name, 'test.length');
	});

	it('function call for statement', () => {
		// eslint-disable-next-line
		const template = '${test()}';
		const parser = new Parser(template);
		parser.parse();

		expect(parser.tokens)
			.to.be.an('array')
			.that.have.lengthOf(1);

		let token = parser.tokens[0];
		compareTokenState(token, 0, 9, tokens.VAR.name, 'test()');
	});
});

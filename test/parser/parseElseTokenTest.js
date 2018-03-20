const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');
const { compareTokenState } = require('../utils/utils');

describe('parse ELSE token', () => {
	describe('valid ELSE token', () => {
		let parser;
		beforeEach(() => {
			const template = '{{else}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if else token exists', () => {
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(1);
		});

		it('check ELSE token', () => {
			const elseToken = parser.tokens[0];

			compareTokenState(elseToken, 0, 8, tokens.ELSE.name, '');
		});
	});

	describe('valid ELSE_IF token', () => {
		let parser;
		beforeEach(() => {
			const template = '{{else logicalStatment}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if ELSE_IF token exists', () => {
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(1);
		});

		it('check ELSE_IF token', () => {
			const elseToken = parser.tokens[0];

			compareTokenState(
				elseToken,
				0,
				24,
				tokens.ELSE.name,
				'logicalStatment'
			);
		});
	});
});

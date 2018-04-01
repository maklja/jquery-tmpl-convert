const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');
const {
	compareStatementTokenState,
	compareExpressionTokenState
} = require('../utils/utils');

describe('parse ELSE token', () => {
	describe('valid ELSE token', () => {
		beforeEach(() => {
			const template = '{{else}}';
			let parser = new Parser(template);
			parser.parse();

			this.tokens = parser.tokens;
		});

		it('check if else token exists', () => {
			expect(this.tokens)
				.to.be.an('array')
				.that.have.lengthOf(1);
		});

		it('check ELSE token', () => {
			const elseToken = this.tokens[0];

			compareStatementTokenState(
				elseToken,
				tokens.ELSE,
				'else',
				{
					expectedStartPosition: 0,
					expectedEndPosition: 8
				},
				false
			);
		});
	});

	describe('valid ELSE_IF token', () => {
		beforeEach(() => {
			const template = '{{else logicalStatment}}';
			let parser = new Parser(template);
			parser.parse();

			this.tokens = parser.tokens;
		});

		it('check if ELSE_IF token exists', () => {
			expect(this.tokens)
				.to.be.an('array')
				.that.have.lengthOf(1);
		});

		it('check ELSE_IF token', () => {
			const elseToken = this.tokens[0];

			compareStatementTokenState(
				elseToken,
				tokens.ELSE,
				'else',
				{
					expectedStartPosition: 0,
					expectedEndPosition: 24
				},
				false
			);

			// expected expression value
			compareExpressionTokenState(
				elseToken.expression,
				'logicalStatment',
				{
					expectedStartPosition: 7,
					expectedEndPosition: 22
				}
			);
		});
	});
});

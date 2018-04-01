const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');
const {
	compareStatementTokenState,
	compareUnknownTokenState,
	compareExpressionTokenState
} = require('../utils/utils');

describe('parse IF token', () => {
	describe('valid IF_START token', () => {
		beforeEach(() => {
			const template = '{{if logicalStatment}}{{/if}}';
			let parser = new Parser(template);
			parser.parse();

			this.tokens = parser.tokens;
		});

		it('check if both tokens exists(IF_START and IF_END)', () => {
			// we have two tags, one for opening tag and one for closing tag
			expect(this.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check IF_START token', () => {
			let ifStartTag = this.tokens[0];

			compareStatementTokenState(
				ifStartTag,
				tokens.IF,
				'if',
				{
					expectedStartPosition: 0,
					expectedEndPosition: 22
				},
				false
			);

			// expected expression value
			compareExpressionTokenState(
				ifStartTag.expression,
				'logicalStatment',
				{
					expectedStartPosition: 5,
					expectedEndPosition: 20
				}
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = this.tokens[1];

			compareStatementTokenState(
				ifEndTag,
				tokens.IF,
				'if',
				{
					expectedStartPosition: 22,
					expectedEndPosition: 29
				},
				true
			);
		});
	});

	describe('invalid if token no space between tag and statement', () => {
		beforeEach(() => {
			const template = '{{iflogicalStatment}}{{/if}}';
			let parser = new Parser(template);
			parser.parse();

			this.tokens = parser.tokens;
		});

		it('check if both tokens exists (UNKNOWN and IF_END)', () => {
			expect(this.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check UNKNOWN token', () => {
			let unknown = this.tokens[0];

			compareUnknownTokenState(unknown, '{{iflogicalStatment}}', {
				expectedStartPosition: 0,
				expectedEndPosition: 21
			});
		});

		it('check IF_END token', () => {
			let ifEndTag = this.tokens[1];

			compareStatementTokenState(
				ifEndTag,
				tokens.IF,
				'if',
				{
					expectedStartPosition: 21,
					expectedEndPosition: 28
				},
				true
			);
		});
	});

	describe('valid if token with multiple spaces around statment', () => {
		beforeEach(() => {
			const template = '{{if         logicalStatment        }}{{/if}}';
			let parser = new Parser(template);
			parser.parse();

			this.tokens = parser.tokens;
		});

		it('check if both tokens exists(IF_START and IF_END)', () => {
			// we have two tags, one for opening tag and one for closing tag
			expect(this.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check IF_START token', () => {
			let ifStartTag = this.tokens[0];

			compareStatementTokenState(
				ifStartTag,
				tokens.IF,
				'if',
				{
					expectedStartPosition: 0,
					expectedEndPosition: 38
				},
				false
			);

			// expected expression value
			compareExpressionTokenState(
				ifStartTag.expression,
				'logicalStatment',
				{
					expectedStartPosition: 13,
					expectedEndPosition: 28
				}
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = this.tokens[1];

			compareStatementTokenState(
				ifEndTag,
				tokens.IF,
				'if',
				{
					expectedStartPosition: 38,
					expectedEndPosition: 45
				},
				true
			);
		});
	});
});

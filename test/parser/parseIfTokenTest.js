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

			compareStatementTokenState(ifStartTag, tokens.IF, 'if', false);

			// expected expression value
			compareExpressionTokenState(
				ifStartTag.expression,
				'logicalStatment'
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = this.tokens[1];

			compareStatementTokenState(ifEndTag, tokens.IF, 'if', true);
		});
	});

	describe('valid IF_START token with negative logical expression', () => {
		beforeEach(() => {
			const template = '{{if !logicalStatment}}{{/if}}';
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

			compareStatementTokenState(ifStartTag, tokens.IF, 'if', false);

			// expected expression value
			compareExpressionTokenState(
				ifStartTag.expression,
				'!logicalStatment'
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = this.tokens[1];

			compareStatementTokenState(ifEndTag, tokens.IF, 'if', true);
		});
	});

	describe('valid IF_START token with complex logical expression', () => {
		beforeEach(() => {
			const template = '{{if type == "test" || type == "test1"}}{{/if}}';
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

			compareStatementTokenState(ifStartTag, tokens.IF, 'if', false);

			// expected expression value
			compareExpressionTokenState(
				ifStartTag.expression,
				'type == "test" || type == "test1"'
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = this.tokens[1];

			compareStatementTokenState(ifEndTag, tokens.IF, 'if', true);
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

			compareUnknownTokenState(unknown, '{{iflogicalStatment}}');
		});

		it('check IF_END token', () => {
			let ifEndTag = this.tokens[1];

			compareStatementTokenState(ifEndTag, tokens.IF, 'if', true);
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

			compareStatementTokenState(ifStartTag, tokens.IF, 'if', false);

			// expected expression value
			compareExpressionTokenState(
				ifStartTag.expression,
				'logicalStatment'
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = this.tokens[1];

			compareStatementTokenState(ifEndTag, tokens.IF, 'if', true);
		});
	});
});

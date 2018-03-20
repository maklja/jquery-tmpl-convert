const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');
const { compareTokenState } = require('../utils/utils');

describe('parse EACH token', () => {
	describe('valid EACH_START token', () => {
		let parser;
		before(() => {
			const template = '{{each collection}}{{/each}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists(EACH_START and EACH_END)', () => {
			// we have two tags, one for opening tag and one for closing tag
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check EACH_START token', () => {
			let eachStartTag = parser.tokens[0];
			compareTokenState(
				eachStartTag,
				0,
				19,
				tokens.EACH_START.name,
				'collection'
			);
		});

		it('check EACH_END token', () => {
			let eachEndTag = parser.tokens[1];
			compareTokenState(eachEndTag, 19, 28, tokens.EACH_END.name, '');
		});
	});

	describe('valid EACH_START token with parameters', () => {
		let parser;
		before(() => {
			const template = '{{each(index, value) collection}}{{/each}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists(EACH_START and EACH_END)', () => {
			// we have two tags, one for opening tag and one for closing tag
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check EACH_START token', () => {
			let eachStartTag = parser.tokens[0];

			expect(eachStartTag)
				// we have params on each token
				.to.have.property('params')
				// we expect params to be return as array
				.that.is.an('array')
				// we have two parameters "index" and "value"
				.with.lengthOf(2)
				// check if expected values are equal
				.that.is.deep.equal(['index', 'value']);

			compareTokenState(
				eachStartTag,
				0,
				33,
				tokens.EACH_START.name,
				'collection'
			);
		});

		it('check EACH_END token', () => {
			let eachEndTag = parser.tokens[1];

			compareTokenState(eachEndTag, 33, 42, tokens.EACH_END.name, '');
		});
	});

	describe('invalid EACH_START token no space between tag and statement', () => {
		let parser;
		beforeEach(() => {
			const template = '{{eachlogicalStatment}}{{/each}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists (UNKNOWN and EACH_END)', () => {
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check UNKNOWN token', () => {
			let unknown = parser.tokens[0];

			compareTokenState(
				unknown,
				0,
				23,
				tokens.UNKNOWN.name,
				'{{eachlogicalStatment}}'
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = parser.tokens[1];

			compareTokenState(ifEndTag, 23, 32, tokens.EACH_END.name, '');
		});
	});

	describe('invalid EACH_START token no closing parentheses', () => {
		let parser;
		beforeEach(() => {
			const template = '{{each(index, value logicalStatment}}{{/each}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists (UNKNOWN and EACH_END)', () => {
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check UNKNOWN token', () => {
			let unknown = parser.tokens[0];

			compareTokenState(
				unknown,
				0,
				37,
				tokens.UNKNOWN.name,
				'{{each(index, value logicalStatment}}'
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = parser.tokens[1];

			compareTokenState(ifEndTag, 37, 46, tokens.EACH_END.name, '');
		});
	});

	describe('valid EACH token with multiple spaces around statment', () => {
		let parser;
		beforeEach(() => {
			const template =
				'{{each         logicalStatment        }}{{/each}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists(EACH_START and EACH_END)', () => {
			// we have two tags, one for opening tag and one for closing tag
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check EACH_START token', () => {
			let ifStartTag = parser.tokens[0];

			compareTokenState(
				ifStartTag,
				0,
				40,
				tokens.EACH_START.name,
				'logicalStatment'
			);
		});

		it('check EACH_END token', () => {
			let ifEndTag = parser.tokens[1];

			compareTokenState(ifEndTag, 40, 49, tokens.EACH_END.name, '');
		});
	});
});

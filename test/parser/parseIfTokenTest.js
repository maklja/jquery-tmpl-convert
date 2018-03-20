const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');
const { compareTokenState } = require('../utils/utils');

describe('parse IF token', () => {
	describe('valid IF_START token', () => {
		let parser;
		beforeEach(() => {
			const template = '{{if logicalStatment}}{{/if}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists(IF_START and IF_END)', () => {
			// we have two tags, one for opening tag and one for closing tag
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check IF_START token', () => {
			let ifStartTag = parser.tokens[0];

			compareTokenState(
				ifStartTag,
				0,
				22,
				tokens.IF_START.name,
				'logicalStatment'
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = parser.tokens[1];

			compareTokenState(ifEndTag, 22, 29, tokens.IF_END.name, '');
		});
	});
	describe('invalid if token no space between tag and statement', () => {
		let parser;
		beforeEach(() => {
			const template = '{{iflogicalStatment}}{{/if}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists (UNKNOWN and IF_END)', () => {
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check UNKNOWN token', () => {
			let unknown = parser.tokens[0];

			compareTokenState(
				unknown,
				0,
				21,
				tokens.UNKNOWN.name,
				'{{iflogicalStatment}}'
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = parser.tokens[1];

			compareTokenState(ifEndTag, 21, 28, tokens.IF_END.name, '');
		});
	});
	describe('valid if token with multiple spaces around statment', () => {
		let parser;
		beforeEach(() => {
			const template = '{{if         logicalStatment        }}{{/if}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists(IF_START and IF_END)', () => {
			// we have two tags, one for opening tag and one for closing tag
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check IF_START token', () => {
			let ifStartTag = parser.tokens[0];

			compareTokenState(
				ifStartTag,
				0,
				38,
				tokens.IF_START.name,
				'logicalStatment'
			);
		});

		it('check IF_END token', () => {
			let ifEndTag = parser.tokens[1];

			compareTokenState(ifEndTag, 38, 45, tokens.IF_END.name, '');
		});
	});
});

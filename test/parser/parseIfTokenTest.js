const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');

describe('parse IF token', function() {
	describe('valid IF_START token', function() {
		let parser;
		beforeEach(function() {
			const template = '{{if logicalStatment}}{{/if}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists(IF_START and IF_END)', function() {
			// we have two tags, one for opening tag and one for closing tag
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check IF_START token', function() {
			let ifStartTag = parser.tokens[0];
			expect(ifStartTag)
				.to.have.property('startPosition')
				.that.is.equal(0);
			expect(ifStartTag)
				.to.have.property('endPosition')
				.that.is.equal(22);
			expect(ifStartTag)
				.to.have.property('name')
				.that.is.equal(tokens.IF_START.name);
			expect(ifStartTag)
				.to.have.property('statement')
				.that.is.equal('logicalStatment');
		});

		it('check IF_END token', function() {
			let ifEndTag = parser.tokens[1];

			expect(ifEndTag)
				.to.have.property('startPosition')
				.that.is.equal(22);
			expect(ifEndTag)
				.to.have.property('endPosition')
				.that.is.equal(29);
			expect(ifEndTag)
				.to.have.property('name')
				.that.is.equal(tokens.IF_END.name);
			expect(ifEndTag).to.have.property('statement').that.is.empty;
		});
	});
	describe('invalid if token no space between tag and statement', function() {
		let parser;
		beforeEach(function() {
			const template = '{{iflogicalStatment}}{{/if}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists (UNKNOWN and IF_END)', function() {
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check UNKNOWN token', function() {
			let unknown = parser.tokens[0];

			expect(unknown)
				.to.have.property('startPosition')
				.that.is.equal(0);
			expect(unknown)
				.to.have.property('endPosition')
				.that.is.equal(20);
			expect(unknown)
				.to.have.property('name')
				.that.is.equal(tokens.UNKNOWN.name);
			expect(unknown)
				.to.have.property('statement')
				.that.is.equal('{{iflogicalStatment}}');
		});

		it('check IF_END token', function() {
			let ifEndTag = parser.tokens[1];
			expect(ifEndTag)
				.to.have.property('startPosition')
				.that.is.equal(21);
			expect(ifEndTag)
				.to.have.property('endPosition')
				.that.is.equal(28);
			expect(ifEndTag)
				.to.have.property('name')
				.that.is.equal(tokens.IF_END.name);
			expect(ifEndTag).to.have.property('statement').that.is.empty;
		});
	});
	describe('valid if token with multiple spaces around statment', function() {
		let parser;
		beforeEach(function() {
			const template = '{{if         logicalStatment        }}{{/if}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if both tokens exists(IF_START and IF_END)', function() {
			// we have two tags, one for opening tag and one for closing tag
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check IF_START token', function() {
			let ifStartTag = parser.tokens[0];
			expect(ifStartTag)
				.to.have.property('startPosition')
				.that.is.equal(0);
			expect(ifStartTag)
				.to.have.property('endPosition')
				.that.is.equal(38);
			expect(ifStartTag)
				.to.have.property('name')
				.that.is.equal(tokens.IF_START.name);
			expect(ifStartTag)
				.to.have.property('statement')
				.that.is.equal('logicalStatment');
		});

		it('check IF_END token', function() {
			let ifEndTag = parser.tokens[1];

			expect(ifEndTag)
				.to.have.property('startPosition')
				.that.is.equal(38);
			expect(ifEndTag)
				.to.have.property('endPosition')
				.that.is.equal(45);
			expect(ifEndTag)
				.to.have.property('name')
				.that.is.equal(tokens.IF_END.name);
			expect(ifEndTag).to.have.property('statement').that.is.empty;
		});
	});
});

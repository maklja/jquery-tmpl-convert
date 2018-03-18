const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');

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
			expect(eachStartTag)
				.to.have.property('startPosition')
				.that.is.equal(0);
			expect(eachStartTag)
				.to.have.property('endPosition')
				.that.is.equal(19);
			expect(eachStartTag)
				.to.have.property('name')
				.that.is.equal(tokens.EACH_START.name);
			expect(eachStartTag)
				.to.have.property('statement')
				.that.is.equal('collection');
		});

		it('check EACH_END token', () => {
			let eachEndTag = parser.tokens[1];

			expect(eachEndTag)
				.to.have.property('startPosition')
				.that.is.equal(19);
			expect(eachEndTag)
				.to.have.property('endPosition')
				.that.is.equal(28);
			expect(eachEndTag)
				.to.have.property('name')
				.that.is.equal(tokens.EACH_END.name);
			expect(eachEndTag).to.have.property('statement').that.is.empty;
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
			expect(eachStartTag)
				.to.have.property('startPosition')
				.that.is.equal(0);
			expect(eachStartTag)
				.to.have.property('endPosition')
				.that.is.equal(33);
			expect(eachStartTag)
				.to.have.property('name')
				.that.is.equal(tokens.EACH_START.name);
			expect(eachStartTag)
				.to.have.property('statement')
				.that.is.equal('collection');
		});

		it('check EACH_END token', () => {
			let eachEndTag = parser.tokens[1];

			expect(eachEndTag)
				.to.have.property('startPosition')
				.that.is.equal(33);
			expect(eachEndTag)
				.to.have.property('endPosition')
				.that.is.equal(42);
			expect(eachEndTag)
				.to.have.property('name')
				.that.is.equal(tokens.EACH_END.name);
			expect(eachEndTag).to.have.property('statement').that.is.empty;
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

			expect(unknown)
				.to.have.property('startPosition')
				.that.is.equal(0);
			expect(unknown)
				.to.have.property('endPosition')
				.that.is.equal(23);
			expect(unknown)
				.to.have.property('name')
				.that.is.equal(tokens.UNKNOWN.name);
			expect(unknown)
				.to.have.property('statement')
				.that.is.equal('{{eachlogicalStatment}}');
		});

		it('check IF_END token', () => {
			let ifEndTag = parser.tokens[1];
			expect(ifEndTag)
				.to.have.property('startPosition')
				.that.is.equal(23);
			expect(ifEndTag)
				.to.have.property('endPosition')
				.that.is.equal(32);
			expect(ifEndTag)
				.to.have.property('name')
				.that.is.equal(tokens.EACH_END.name);
			expect(ifEndTag).to.have.property('statement').that.is.empty;
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

			expect(unknown)
				.to.have.property('startPosition')
				.that.is.equal(0);
			expect(unknown)
				.to.have.property('endPosition')
				.that.is.equal(37);
			expect(unknown)
				.to.have.property('name')
				.that.is.equal(tokens.UNKNOWN.name);
			expect(unknown)
				.to.have.property('statement')
				.that.is.equal('{{each(index, value logicalStatment}}');
		});

		it('check IF_END token', () => {
			let ifEndTag = parser.tokens[1];
			expect(ifEndTag)
				.to.have.property('startPosition')
				.that.is.equal(37);
			expect(ifEndTag)
				.to.have.property('endPosition')
				.that.is.equal(46);
			expect(ifEndTag)
				.to.have.property('name')
				.that.is.equal(tokens.EACH_END.name);
			expect(ifEndTag).to.have.property('statement').that.is.empty;
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
			expect(ifStartTag)
				.to.have.property('startPosition')
				.that.is.equal(0);
			expect(ifStartTag)
				.to.have.property('endPosition')
				.that.is.equal(40);
			expect(ifStartTag)
				.to.have.property('name')
				.that.is.equal(tokens.EACH_START.name);
			expect(ifStartTag)
				.to.have.property('statement')
				.that.is.equal('logicalStatment');
		});

		it('check EACH_END token', () => {
			let ifEndTag = parser.tokens[1];

			expect(ifEndTag)
				.to.have.property('startPosition')
				.that.is.equal(40);
			expect(ifEndTag)
				.to.have.property('endPosition')
				.that.is.equal(49);
			expect(ifEndTag)
				.to.have.property('name')
				.that.is.equal(tokens.EACH_END.name);
			expect(ifEndTag).to.have.property('statement').that.is.empty;
		});
	});
});

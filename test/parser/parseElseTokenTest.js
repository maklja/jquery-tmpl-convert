const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');

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

			expect(elseToken)
				.to.have.property('startPosition')
				.to.be.equal(0);
			expect(elseToken)
				.to.have.property('endPosition')
				.to.be.equal(8);
			expect(elseToken)
				.to.have.property('name')
				.to.be.equal(tokens.ELSE.name);
			expect(elseToken).to.have.property('statement').to.be.empty;
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

			expect(elseToken)
				.to.have.property('startPosition')
				.to.be.equal(0);
			expect(elseToken)
				.to.have.property('endPosition')
				.to.be.equal(24);
			expect(elseToken)
				.to.have.property('name')
				.to.be.equal(tokens.ELSE.name);
			expect(elseToken)
				.to.have.property('statement')
				.to.be.equal('logicalStatment');
		});
	});
});

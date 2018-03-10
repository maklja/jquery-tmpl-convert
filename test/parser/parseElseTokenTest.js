const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');

describe('parse ELSE token', function() {
	describe('valid ELSE token', function() {
		let parser;
		beforeEach(function() {
			const template = '{{else}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if else token exists', function() {
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(1);
		});

		it('check ELSE token', function() {
			const elseToken = parser.tokens[0];

			expect(elseToken)
				.to.have.property('startPosition')
				.to.be.equal(0);
			expect(elseToken)
				.to.have.property('endPosition')
				.to.be.equal(8);
			expect(elseToken)
				.to.have.property('type')
				.to.be.equal(tokens.ELSE.name);
			expect(elseToken).to.have.property('statement').to.be.empty;
		});
	});

	describe('valid ELSE_IF token', function() {
		let parser;
		beforeEach(function() {
			const template = '{{else logicalStatment}}';
			parser = new Parser(template);
			parser.parse();
		});

		it('check if ELSE_IF token exists', function() {
			expect(parser.tokens)
				.to.be.an('array')
				.that.have.lengthOf(1);
		});

		it('check ELSE_IF token', function() {
			const elseToken = parser.tokens[0];

			expect(elseToken)
				.to.have.property('startPosition')
				.to.be.equal(0);
			expect(elseToken)
				.to.have.property('endPosition')
				.to.be.equal(24);
			expect(elseToken)
				.to.have.property('type')
				.to.be.equal(tokens.ELSE_IF.name);
			expect(elseToken)
				.to.have.property('statement')
				.to.be.equal('logicalStatment');
		});
	});
});

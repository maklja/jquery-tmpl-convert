const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');

describe('parse VAR token', () => {
	it('startPosition 0, endPosition 7 and name is var', () => {
		// eslint-disable-next-line
		const template = '${test}';
		const parser = new Parser(template);
		parser.parse();

		expect(parser.tokens)
			.to.be.an('array')
			.that.have.lengthOf(1);

		let token = parser.tokens[0];
		expect(token)
			.to.have.property('startPosition')
			.that.is.equal(0);
		expect(token)
			.to.have.property('endPosition')
			.that.is.equal(7);
		expect(token)
			.to.have.property('name')
			.that.is.equal(tokens.VAR.name);
		expect(token)
			.to.have.property('statement')
			.that.is.equal('test');
	});

	it('variable for statement', () => {
		// eslint-disable-next-line
		const template = '${test}';
		const parser = new Parser(template);
		parser.parse();

		expect(parser.tokens)
			.to.be.an('array')
			.that.have.lengthOf(1);

		let token = parser.tokens[0];
		expect(token)
			.to.have.property('statement')
			.that.is.equal('test');
	});

	it('object property for statement', () => {
		// eslint-disable-next-line
		const template = '${test.length}';
		const parser = new Parser(template);
		parser.parse();

		expect(parser.tokens)
			.to.be.an('array')
			.that.have.lengthOf(1);

		let token = parser.tokens[0];
		expect(token)
			.to.have.property('statement')
			.that.is.equal('test.length');
	});

	it('function call for statement', () => {
		// eslint-disable-next-line
		const template = '${test()}';
		const parser = new Parser(template);
		parser.parse();

		expect(parser.tokens)
			.to.be.an('array')
			.that.have.lengthOf(1);

		let token = parser.tokens[0];
		expect(token)
			.to.have.property('statement')
			.that.is.equal('test()');
	});
});

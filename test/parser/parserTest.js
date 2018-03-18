const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');

describe('Parser', function() {
	it('initialize parser, tokens are empty and position is 0', () => {
		const parser = new Parser('{{if}}Show it{{/if}}');
		expect(parser.tokens).to.be.empty;
	});

	it('syntax error, there is no closing tag on {{if ...', () => {
		const parser = new Parser('{{if testShow it{{/if');
		parser.parse();

		let unknown = parser.tokens[0];

		expect(unknown)
			.to.have.property('startPosition')
			.that.is.equal(0);
		expect(unknown)
			.to.have.property('endPosition')
			.that.is.equal(21);
		expect(unknown)
			.to.have.property('name')
			.that.is.equal(tokens.UNKNOWN.name);
		expect(unknown)
			.to.have.property('statement')
			.that.is.equal('{{if testShow it{{/if');
	});
});

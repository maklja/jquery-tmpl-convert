const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');

describe('Parser', function() {
	it('initialize parser, tokens are empty and position is 0', function() {
		const parser = new Parser('{{if}}Show it{{/if}}');
		expect(parser.tokens).to.be.empty;
		expect(parser.position).to.be.equal(0);
	});
});

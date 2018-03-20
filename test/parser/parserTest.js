const chai = require('chai');

const expect = chai.expect;
const { compareTokenState } = require('../utils/utils');
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');

describe('Parser', () => {
	it('initialize parser, tokens are empty', () => {
		const parser = new Parser('{{if}}Show it{{/if}}');
		expect(parser.tokens).to.be.empty;
	});

	it('syntax error, there is no closing tag on {{if ...', () => {
		const parser = new Parser('{{if testShow it{{/if');
		parser.parse();

		let unknownToken = parser.tokens[0];

		compareTokenState(
			unknownToken,
			// token begins from start of the text for token
			0,
			// tokens ends
			21,
			// token is not valid so it will be unknown type
			tokens.UNKNOWN.name,
			// token statement, unknown tokens statements are all text
			'{{if testShow it{{/if'
		);
	});

	it('parse valid HTML token', () => {
		const parser = new Parser('{{html testShow}}');
		parser.parse();

		let unknownToken = parser.tokens[0];

		compareTokenState(
			unknownToken,
			// token begins from start of the text for token
			0,
			// tokens ends
			17,
			// token is valid and it is HTML token
			tokens.HTML.name,
			// token statement, HTML token for statement will have property of function that returns html text
			'testShow'
		);
	});

	it('parse invalid HTML token with function call', () => {
		const parser = new Parser('{{html(test, test) testShow}}');
		parser.parse();

		let unknownToken = parser.tokens[0];

		compareTokenState(
			unknownToken,
			// token begins from start of the text for token
			0,
			// tokens ends
			29,
			// token is not valid because HTML token does not support function call
			tokens.UNKNOWN.name,
			// UNKNOWN token will have all text from statement
			'{{html(test, test) testShow}}'
		);
	});

	it('parse valid TMPL token', () => {
		const parser = new Parser('{{tmpl "#testTmpl"}}');
		parser.parse();

		let unknownToken = parser.tokens[0];

		compareTokenState(
			unknownToken,
			// token begins from start of the text for token
			0,
			// tokens ends
			20,
			// token is valid and it is TMPL token
			tokens.TMPL.name,
			// token statement, HTML token for statement will have id of the template
			'"#testTmpl"'
		);
	});

	it('parse valid TMPL token with function call', () => {
		const parser = new Parser('{{tmpl(param1, param2) "#testTmpl"}}');
		parser.parse();

		let unknownToken = parser.tokens[0];

		compareTokenState(
			unknownToken,
			// token begins from start of the text for token
			0,
			// tokens ends
			36,
			// token is not valid because HTML token does not support function call
			tokens.TMPL.name,
			// UNKNOWN token will have all text from statement
			'"#testTmpl"'
		);

		expect(unknownToken)
			// token must have params property
			.to.have.property('params')
			// that is an array
			.that.is.an('array')
			// we passed two parameters to function call
			.that.have.lengthOf(2)
			// first parameter is 'param1' and second one is 'param2'
			.that.is.deep.equal(['param1', 'param2']);
	});
});

const chai = require('chai');

const expect = chai.expect;
const {
	compareStatementTokenState,
	compareUnknownTokenState,
	compareParameterTokenState,
	compareExpressionTokenState,
	compareValidationErrorState
} = require('../utils/utils');
const { PARSE_ERROR } = require('../../src/validator/error_code');
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

		compareUnknownTokenState(
			unknownToken,
			// token value, in this case token value is same as name
			'{{if testShow it{{/if',
			{
				// token begins from start of the text for token
				expectedStartPosition: 0,
				// tokens ends
				expectedEndPosition: 21
			}
		);

		// we expect that parse errors do not exists because regex won't find
		// tokens that are not between {{}}
		expect(parser.parseErrors).to.be.an('array').that.is.empty;
	});

	it('parse valid HTML token', () => {
		const parser = new Parser('{{html testShow}}');
		parser.parse();

		let htmlToken = parser.tokens[0];

		compareStatementTokenState(
			htmlToken,
			// token is valid and it is HTML token
			tokens.HTML.name,
			// token value, in this case token value is same as name
			'html',
			{
				// token begins from start of the text for token
				expectedStartPosition: 0,
				// tokens ends
				expectedEndPosition: 17
			},
			false
		);

		// expected expression value
		compareExpressionTokenState(htmlToken.expression, 'testShow', {
			expectedStartPosition: 7,
			expectedEndPosition: 15
		});

		// token is valid
		expect(parser.parseErrors).to.be.an('array').that.is.empty;
	});

	it('parse invalid HTML token with function call', () => {
		const parser = new Parser('{{html(test, test) testShow}}');
		parser.parse();

		let unknownToken = parser.tokens[0];

		compareUnknownTokenState(
			unknownToken,
			// UNKNOWN token will have all text from statement
			'{{html(test, test) testShow}}',
			{
				// token begins from start of the text for token
				expectedStartPosition: 0,
				// tokens ends
				expectedEndPosition: 29
			}
		);

		// token is valid because there is no pattern for html as function call
		expect(parser.parseErrors)
			.to.be.an('array')
			.that.have.lengthOf(1);

		compareValidationErrorState(
			parser.parseErrors[0],
			'{{html(test, test) testShow}}',
			PARSE_ERROR.code
		);
	});

	it('parse valid TMPL token', () => {
		const parser = new Parser('{{tmpl "#testTmpl"}}');
		parser.parse();

		let tmplToken = parser.tokens[0];

		compareStatementTokenState(
			tmplToken,
			// token is valid and it is TMPL token
			tokens.TMPL.name,
			// token value, in this case token value is same as name
			'tmpl',
			{
				// token begins from start of the text for token
				expectedStartPosition: 0,
				// tokens ends
				expectedEndPosition: 20
			},
			false
		);

		// expected expression value
		compareExpressionTokenState(tmplToken.expression, '"#testTmpl"', {
			expectedStartPosition: 7,
			expectedEndPosition: 18
		});

		// token is valid
		expect(parser.parseErrors).to.be.an('array').that.is.empty;
	});

	it('parse valid TMPL token with function call', () => {
		const parser = new Parser('{{tmpl(param1, param2) "#testTmpl"}}');
		parser.parse();

		let tmplToken = parser.tokens[0];

		compareStatementTokenState(
			tmplToken,
			// token is valid and it is TMPL token
			tokens.TMPL.name,
			// token value, in this case token value is same as name
			'tmpl(param1,param2)',
			{
				// token begins from start of the text for token
				expectedStartPosition: 0,
				// tokens ends
				expectedEndPosition: 36
			},
			false
		);

		// expected expression value
		compareExpressionTokenState(tmplToken.expression, '"#testTmpl"', {
			expectedStartPosition: 23,
			expectedEndPosition: 34
		});

		// token is valid
		expect(parser.parseErrors).to.be.an('array').that.is.empty;

		expect(tmplToken)
			// token must have params property
			.to.have.property('parameters')
			// that is an array
			.that.is.an('array')
			// we passed two parameters to function call
			.that.have.lengthOf(2);

		// first parameter has value 'param1' and second one has value 'param2'
		let param1 = tmplToken.parameters[0];
		compareParameterTokenState(param1, 'param1', {
			expectedStartPosition: 7,
			expectedEndPosition: 13
		});

		let param2 = tmplToken.parameters[1];
		compareParameterTokenState(param2, 'param2', {
			expectedStartPosition: 15,
			expectedEndPosition: 21
		});
	});
});

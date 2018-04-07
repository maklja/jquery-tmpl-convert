const chai = require('chai');

const expect = chai.expect;
const {
	compareStatementTokenState,
	compareUnknownTokenState,
	compareParameterTokenState,
	compareExpressionTokenState,
	compareValidationErrorState
} = require('../utils/utils');
const { PARSE_ERROR } = require('../../src/model/error_code');
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');

describe('Parser', () => {
	it('initialize parser, tokens are empty', () => {
		const parser = new Parser('{{if}}Show it{{/if}}');
		expect(parser.tokens).to.be.empty;
		expect(parser.parseErrors).to.be.empty;
		expect(parser.isValidatingTokens).to.be.true;
	});

	it('syntax error, there is no closing tag on {{if ...', () => {
		const parser = new Parser('{{if testShow it{{/if');
		parser.parse();

		let unknownToken = parser.tokens[0];

		compareUnknownTokenState(
			unknownToken,
			// token value, in this case token value is same as name
			'{{if testShow it{{/if'
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
			tokens.HTML,
			// token value, in this case token value is same as name
			'html',
			false
		);

		// expected expression value
		compareExpressionTokenState(htmlToken.expression, 'testShow');

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
			'{{html(test, test) testShow}}'
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
			tokens.TMPL,
			// token value, in this case token value is same as name
			'tmpl',
			false
		);

		// expected expression value
		compareExpressionTokenState(tmplToken.expression, '"#testTmpl"');

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
			tokens.TMPL,
			// token value, in this case token value is same as name
			'tmpl(param1,param2)',
			false
		);

		// expected expression value
		compareExpressionTokenState(tmplToken.expression, '"#testTmpl"');

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
		compareParameterTokenState(param1, 'param1');

		let param2 = tmplToken.parameters[1];
		compareParameterTokenState(param2, 'param2');
	});
});

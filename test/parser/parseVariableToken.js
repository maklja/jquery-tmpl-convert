const chai = require('chai');

const expect = chai.expect;
const {
	compareExpressionTokenState,
	compareValidationErrorState
} = require('../utils/utils');
const Parser = require('../../src/parser/Parser');
const { PARSE_ERROR } = require('../../src/model/error_code');

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
		compareExpressionTokenState(token, 'test');
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
		compareExpressionTokenState(token, 'test');
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
		compareExpressionTokenState(token, 'test.length');
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
		compareExpressionTokenState(token, 'test()');
	});

	it('invalid expression, parse failed', () => {
		// eslint-disable-next-line
		const template = '${test({)}';
		const parser = new Parser(template);
		parser.parse();

		// parse failed so we have 1 error
		expect(parser.parseErrors)
			.to.be.an('array')
			.that.have.lengthOf(1);

		compareValidationErrorState(
			// take the only error from the array
			parser.parseErrors[0],
			template,
			PARSE_ERROR.code
		);
	});

	it('invalid expression, empty expression', () => {
		// eslint-disable-next-line
		const template = '${   }';
		const parser = new Parser(template);
		parser.parse();

		// parse failed so we have 1 error
		expect(parser.parseErrors)
			.to.be.an('array')
			.that.have.lengthOf(1);

		compareValidationErrorState(
			// take the only error from the array
			parser.parseErrors[0],
			template,
			PARSE_ERROR.code
		);
	});
});

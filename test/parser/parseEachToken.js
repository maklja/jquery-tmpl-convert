const chai = require('chai');

const expect = chai.expect;
const Parser = require('../../src/parser/Parser');
const tokens = require('../../src/tokens/tokens');
const {
	compareStatementTokenState,
	compareUnknownTokenState,
	compareParameterTokenState,
	compareExpressionTokenState
} = require('../utils/utils');

describe('parse EACH token', () => {
	describe('valid EACH_START token', () => {
		before(() => {
			const template = '{{each collection}}{{/each}}';
			let parser = new Parser(template);
			parser.parse();

			this.tokens = parser.tokens;
		});

		it('check if both tokens exists(EACH_START and EACH_END)', () => {
			// we have two tags, one for opening tag and one for closing tag
			expect(this.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check EACH_START token', () => {
			let eachStartTag = this.tokens[0];
			compareStatementTokenState(
				eachStartTag,
				tokens.EACH,
				'each',
				{
					expectedStartPosition: 0,
					expectedEndPosition: 19
				},
				false
			);

			// expected expression value
			compareExpressionTokenState(eachStartTag.expression, 'collection', {
				expectedStartPosition: 7,
				expectedEndPosition: 17
			});

			// we do not have any parameters in statement
			expect(eachStartTag).that.have.property('parameters').that.is.null;
		});

		it('check EACH_END token', () => {
			let eachEndTag = this.tokens[1];
			compareStatementTokenState(
				eachEndTag,
				tokens.EACH,
				'each',
				{
					expectedStartPosition: 19,
					expectedEndPosition: 28
				},
				true
			);
		});
	});

	describe('valid EACH_START token with parameters', () => {
		before(() => {
			const template = '{{each(index, value) collection}}{{/each}}';
			let parser = new Parser(template);
			parser.parse();

			this.tokens = parser.tokens;
		});

		it('check if both tokens exists(EACH_START and EACH_END)', () => {
			// we have two tags, one for opening tag and one for closing tag
			expect(this.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check EACH_START token', () => {
			let eachStartTag = this.tokens[0];

			expect(eachStartTag)
				// we have params on each token
				.to.have.property('parameters')
				// we expect params to be return as array
				.that.is.an('array')
				// we have two parameters "index" and "value"
				.with.lengthOf(2);

			// check if expected values are equal
			compareParameterTokenState(eachStartTag.parameters[0], 'index', {
				expectedStartPosition: 7,
				expectedEndPosition: 12
			});
			compareParameterTokenState(eachStartTag.parameters[1], 'value', {
				expectedStartPosition: 14,
				expectedEndPosition: 19
			});

			compareStatementTokenState(
				eachStartTag,
				tokens.EACH,
				'each(index,value)',
				{
					expectedStartPosition: 0,
					expectedEndPosition: 33
				},
				false
			);

			// expected expression value
			compareExpressionTokenState(eachStartTag.expression, 'collection', {
				expectedStartPosition: 21,
				expectedEndPosition: 31
			});
		});

		it('check EACH_END token', () => {
			let eachEndTag = this.tokens[1];

			compareStatementTokenState(
				eachEndTag,
				tokens.EACH,
				'each',
				{
					expectedStartPosition: 33,
					expectedEndPosition: 42
				},
				true
			);
		});
	});

	describe('invalid EACH_START token no space between tag and statement', () => {
		beforeEach(() => {
			const template = '{{eachlogicalStatment}}{{/each}}';
			let parser = new Parser(template);
			parser.parse();

			this.tokens = parser.tokens;
		});

		it('check if both tokens exists (UNKNOWN and EACH_END)', () => {
			expect(this.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check UNKNOWN token', () => {
			let unknown = this.tokens[0];

			compareUnknownTokenState(unknown, '{{eachlogicalStatment}}', {
				expectedStartPosition: 0,
				expectedEndPosition: 23
			});
		});

		it('check EACH_END token', () => {
			let eachEndTag = this.tokens[1];

			compareStatementTokenState(
				eachEndTag,
				tokens.EACH,
				'each',
				{
					expectedStartPosition: 23,
					expectedEndPosition: 32
				},
				true
			);
		});
	});

	describe('invalid EACH_START token no closing parentheses', () => {
		beforeEach(() => {
			const template = '{{each(index, value logicalStatment}}{{/each}}';
			let parser = new Parser(template);
			parser.parse();

			this.tokens = parser.tokens;
		});

		it('check if both tokens exists (UNKNOWN and EACH_END)', () => {
			expect(this.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check UNKNOWN token', () => {
			let unknown = this.tokens[0];

			compareUnknownTokenState(
				unknown,
				'{{each(index, value logicalStatment}}',
				{
					expectedStartPosition: 0,
					expectedEndPosition: 37
				}
			);
		});

		it('check EACH_END token', () => {
			let eachEndTag = this.tokens[1];

			compareStatementTokenState(
				eachEndTag,
				tokens.EACH,
				'each',
				{
					expectedStartPosition: 37,
					expectedEndPosition: 46
				},
				true
			);
		});
	});

	describe('valid EACH token with multiple spaces around statment', () => {
		beforeEach(() => {
			const template =
				'{{each         logicalStatment        }}{{/each}}';
			let parser = new Parser(template);
			parser.parse();

			this.tokens = parser.tokens;
		});

		it('check if both tokens exists(EACH_START and EACH_END)', () => {
			// we have two tags, one for opening tag and one for closing tag
			expect(this.tokens)
				.to.be.an('array')
				.that.have.lengthOf(2);
		});

		it('check EACH_START token', () => {
			let eachStartTag = this.tokens[0];

			compareStatementTokenState(
				eachStartTag,
				tokens.EACH,
				'each',
				{
					expectedStartPosition: 0,
					expectedEndPosition: 40
				},
				false
			);

			// expected expression value
			compareExpressionTokenState(
				eachStartTag.expression,
				'logicalStatment',
				{
					expectedStartPosition: 15,
					expectedEndPosition: 30
				}
			);
		});

		it('check EACH_END token', () => {
			let eachEndTag = this.tokens[1];

			compareStatementTokenState(
				eachEndTag,
				tokens.EACH,
				'each',
				{
					expectedStartPosition: 40,
					expectedEndPosition: 49
				},
				true
			);
		});
	});
});

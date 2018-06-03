const chai = require('chai');

const expect = chai.expect;
const {
	EXPRESSION_MISSING,
	UNEXPECTED_EXPRESSION,
	MISSING_CLOSING_TOKEN,
	MISSING_STARTING_TOKEN,
	MISSING_SIBLING_TOKEN
} = require('../../src/model/error_code');
const {
	EACH,
	IF,
	ELSE,
	findStatementTokenPatternByName
} = require('../../src/tokens/tokens');
const { compareValidationErrorState } = require('../utils/utils');
const Expression = require('../../src/model/Expression');
const Statement = require('../../src/model/Statement');
const Validator = require('../../src/validator/Validator');

describe('Rule Matcher test', () => {
	describe('test variable rules', () => {
		it('valid variable token with statement', () => {
			const validator = new Validator([new Expression('varName', null)]);

			const validationErrors = validator.validate();

			expect(validationErrors).to.be.an('array').that.is.empty;
		});
	});

	describe('test if rules', () => {
		it('valid if token with statement', () => {
			const validator = new Validator([
				new Statement(
					IF,
					'if',
					null,
					new Expression('test.length', null),
					false,
					null,
					findStatementTokenPatternByName(IF)
				),
				new Statement(
					IF,
					'if',
					null,
					null,
					true,
					null,
					findStatementTokenPatternByName(IF, true)
				)
			]);
			// first validate start IF token
			const iftokenValidationErrors = validator.validate();

			expect(iftokenValidationErrors).to.be.an('array').that.is.empty;
		});

		it('invalid if token without statement', () => {
			const validateTokens = [
				new Statement(
					IF,
					'if',
					null,
					null, // mandatory expression is null
					false,
					null,
					findStatementTokenPatternByName(IF)
				),
				new Statement(
					IF,
					'if',
					null,
					null,
					true,
					null,
					findStatementTokenPatternByName(IF, true)
				)
			];
			const validator = new Validator(validateTokens);
			// first validate start IF token, validation will fail
			// because mandatory expression is not set
			const noStatementError = validator.validate();

			expect(noStatementError)
				.that.is.an('array')
				.that.have.lengthOf(1);

			compareValidationErrorState(
				noStatementError[0],
				validateTokens[0].id,
				EXPRESSION_MISSING.code
			);
		});

		it('invalid IF_END token unexpected statement', () => {
			const validateTokens = [
				new Statement(
					IF,
					'if',
					null,
					new Expression('collection.length', null),
					false,
					null,
					findStatementTokenPatternByName(IF)
				),
				new Statement(
					IF,
					'if',
					null,
					new Expression('unexpected.expression', null), // close if does not have expression
					true,
					null,
					findStatementTokenPatternByName(IF, true)
				)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors)
				.that.is.an('array')
				.that.have.lengthOf(1);

			// close if can't have expression so error will be that is unexpected expression
			compareValidationErrorState(
				validationErrors[0],
				validateTokens[1].id,
				UNEXPECTED_EXPRESSION.code
			);
		});

		it("IF_END token doesn't exists", () => {
			const validateTokens = [
				new Statement(
					IF,
					'if',
					null,
					new Expression('collection.length', null),
					false,
					null,
					findStatementTokenPatternByName(IF)
				)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors)
				.that.is.an('array')
				.that.have.lengthOf(1);

			compareValidationErrorState(
				validationErrors[0],
				validateTokens[0].id,
				MISSING_CLOSING_TOKEN.code
			);
		});

		it('IF_START token does not exists', () => {
			const validateTokens = [
				new Statement(
					IF,
					'if',
					null,
					null,
					true,
					null,
					findStatementTokenPatternByName(IF, true)
				)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors)
				.that.is.an('array')
				.that.have.lengthOf(1);

			// close if can't have expression so error will be that is unexpected expression
			compareValidationErrorState(
				validationErrors[0],
				validateTokens[0].id,
				MISSING_STARTING_TOKEN.code
			);
		});
	});

	describe('test each rules', () => {
		it('valid each token with statement', () => {
			const validateTokens = [
				new Statement(
					EACH,
					'each',
					null,
					new Statement('collection', null),
					false,
					null,
					findStatementTokenPatternByName(EACH)
				),
				new Statement(
					EACH,
					'each',
					null,
					null,
					true,
					null,
					findStatementTokenPatternByName(EACH, true)
				)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors).to.be.an('array').that.is.empty;
		});

		it('invalid each token without statement', () => {
			const validateTokens = [
				new Statement(
					EACH,
					'each',
					null,
					null, // mandatory statement missing
					false,
					null,
					findStatementTokenPatternByName(EACH)
				),
				new Statement(
					EACH,
					'each',
					null,
					null,
					true,
					null,
					findStatementTokenPatternByName(EACH, true)
				)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors)
				.that.is.an('array')
				.that.have.lengthOf(1);

			compareValidationErrorState(
				validationErrors[0],
				validateTokens[0].id,
				EXPRESSION_MISSING.code
			);
		});

		it('invalid EACH_END token unexpected statement', () => {
			const validateTokens = [
				new Statement(
					EACH,
					'each',
					null,
					new Statement('collection', null),
					false,
					null,
					findStatementTokenPatternByName(EACH)
				),
				new Statement(
					EACH,
					'each',
					null,
					new Statement('unexpected.statement', null),
					true,
					null,
					findStatementTokenPatternByName(EACH, true)
				)
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors)
				.that.is.an('array')
				.that.have.lengthOf(1);

			compareValidationErrorState(
				validationErrors[0],
				validateTokens[1].id,
				UNEXPECTED_EXPRESSION.code
			);
		});

		it("EACH_END token doesn't exists", () => {
			const validateTokens = [
				new Statement(
					EACH,
					'each',
					null,
					new Statement('collection', null),
					false,
					null,
					findStatementTokenPatternByName(EACH)
				)
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors)
				.that.is.an('array')
				.that.have.lengthOf(1);

			compareValidationErrorState(
				validationErrors[0],
				validateTokens[0].id,
				MISSING_CLOSING_TOKEN.code
			);
		});

		it('EACH_START token does not exists', () => {
			const validateTokens = [
				new Statement(
					EACH,
					'each',
					null,
					null,
					true,
					null,
					findStatementTokenPatternByName(EACH, true)
				)
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors)
				.that.is.an('array')
				.that.have.lengthOf(1);

			compareValidationErrorState(
				validationErrors[0],
				validateTokens[0].id,
				MISSING_STARTING_TOKEN.code
			);
		});
	});

	describe('test else rules', () => {
		it('valid ELSE token', () => {
			const validateTokens = [
				new Statement(
					IF,
					'if',
					null,
					new Expression('test.length', null),
					false,
					null,
					findStatementTokenPatternByName(IF)
				),
				new Statement(
					ELSE,
					'else',
					null,
					null,
					false,
					null,
					findStatementTokenPatternByName(ELSE)
				),
				new Statement(
					IF,
					'if',
					null,
					null,
					true,
					null,
					findStatementTokenPatternByName(IF, true)
				)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors).to.be.an('array').that.is.empty;
		});

		it('valid ELSE_IF and ELSE tokens', () => {
			const validateTokens = [
				new Statement(
					IF,
					'if',
					null,
					new Expression('test.length', null),
					false,
					null,
					findStatementTokenPatternByName(IF)
				),
				new Statement(
					ELSE,
					'else',
					null,
					new Expression('otherTest.length', null),
					false,
					null,
					findStatementTokenPatternByName(ELSE)
				),
				new Statement(
					ELSE,
					'else',
					null,
					new Expression('test', null),
					false,
					null,
					findStatementTokenPatternByName(ELSE)
				),
				new Statement(
					ELSE,
					'else',
					null,
					null,
					false,
					null,
					findStatementTokenPatternByName(ELSE)
				),
				new Statement(
					IF,
					'if',
					null,
					null,
					true,
					null,
					findStatementTokenPatternByName(IF, true)
				)
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors).to.be.an('array').that.is.empty;
		});

		it('invalid ELSE token missing sibling IF_START', () => {
			const validateTokens = [
				new Statement(
					ELSE,
					'else',
					null,
					null,
					false,
					null,
					findStatementTokenPatternByName(ELSE)
				)
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors)
				.that.is.an('array')
				.that.have.lengthOf(1);

			compareValidationErrorState(
				validationErrors[0],
				validateTokens[0].id,
				MISSING_SIBLING_TOKEN.code
			);
		});

		it('invalid ELSE_IF token missing sibling IF_START or ELSE_IF', () => {
			const validateTokens = [
				new Statement(
					ELSE,
					'else',
					null,
					new Statement('test.length', null),
					false,
					null,
					findStatementTokenPatternByName(ELSE)
				)
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			compareValidationErrorState(
				validationErrors[0],
				validateTokens[0].id,
				MISSING_SIBLING_TOKEN.code
			);
		});
	});
});

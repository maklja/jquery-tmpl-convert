const chai = require('chai');

const expect = chai.expect;
const {
	STATMENT_MISSING,
	UNEXPECTED_STATMENT,
	MISSING_CLOSING_TOKEN,
	MISSING_STARTING_TOKEN,
	MISSING_SIBLING_TOKEN
} = require('../../src/validator/error_code');
const tokens = require('../../src/tokens/tokens');
const Token = require('../../src/model/Token');
const Validator = require('../../src/validator/Validator');

const validationErrorsCheck = (
	validationErrors,
	expectedError,
	tokenWithError
) => {
	expect(validationErrors)
		.to.be.an('array')
		.that.have.lengthOf(1);

	const validationError = validationErrors[0];
	expect(validationError).to.have.property('message').that.is.not.empty;
	expect(validationError)
		.to.have.property('errorCode')
		.that.is.equal(expectedError.code);
	expect(validationError)
		.to.have.property('token')
		.that.is.deep.equal(tokenWithError);
};

describe('Rule Matcher test', () => {
	describe('test variable rules', () => {
		it('valid variable token with statement', () => {
			const validateTokens = [
				new Token(tokens.VAR.name, 0, 10, 'varName')
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors).to.be.an('array').that.is.empty;
		});

		it('invalid variable token without statement', () => {
			const validateTokens = [new Token(tokens.VAR.name, 0, 10, null)];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				STATMENT_MISSING,
				validateTokens[0]
			);
		});
	});

	describe('test if rules', () => {
		it('valid if token with statement', () => {
			const validateTokens = [
				new Token(tokens.IF_START.name, 0, 10, 'test.length'),
				new Token(tokens.IF_END.name, 0, 10)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors).to.be.an('array').that.is.empty;
		});

		it('invalid if token without statement', () => {
			const validateTokens = [
				new Token(tokens.IF_START.name, 0, 10, null),
				new Token(tokens.IF_END.name, 0, 10)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				STATMENT_MISSING,
				validateTokens[0]
			);
		});

		it('invalid IF_END token unexpected statement', () => {
			const validateTokens = [
				new Token(tokens.IF_START.name, 0, 10, 'test.length'),
				new Token(tokens.IF_END.name, 0, 10, 'unexpected.statement')
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				UNEXPECTED_STATMENT,
				validateTokens[1]
			);
		});

		it("IF_END token doesn't exists", () => {
			const validateTokens = [
				new Token(tokens.IF_START.name, 0, 10, 'test.length')
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				MISSING_CLOSING_TOKEN,
				validateTokens[0]
			);
		});

		it('IF_START token does not exists', () => {
			const validateTokens = [new Token(tokens.IF_END.name, 0, 10)];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				MISSING_STARTING_TOKEN,
				validateTokens[0]
			);

			expect(validationErrors)
				.to.be.an('array')
				.that.have.lengthOf(1);
		});
	});

	describe('test each rules', () => {
		it('valid each token with statement', () => {
			const validateTokens = [
				new Token(tokens.EACH_START.name, 0, 10, 'test.length'),
				new Token(tokens.EACH_END.name, 0, 10)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors).to.be.an('array').that.is.empty;
		});

		it('invalid each token without statement', () => {
			const validateTokens = [
				new Token(tokens.EACH_START.name, 0, 10, null),
				new Token(tokens.EACH_END.name, 0, 10)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				STATMENT_MISSING,
				validateTokens[0]
			);
		});

		it('invalid EACH_END token unexpected statement', () => {
			const validateTokens = [
				new Token(tokens.EACH_START.name, 0, 10, 'test.length'),
				new Token(tokens.EACH_END.name, 0, 10, 'unexpected.statement')
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				UNEXPECTED_STATMENT,
				validateTokens[1]
			);
		});

		it("EACH_END token doesn't exists", () => {
			const validateTokens = [
				new Token(tokens.EACH_START.name, 0, 10, 'test.length')
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				MISSING_CLOSING_TOKEN,
				validateTokens[0]
			);
		});

		it('EACH_START token does not exists', () => {
			const validateTokens = [new Token(tokens.EACH_END.name, 0, 10)];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				MISSING_STARTING_TOKEN,
				validateTokens[0]
			);

			expect(validationErrors)
				.to.be.an('array')
				.that.have.lengthOf(1);
		});
	});

	describe('test else rules', () => {
		it('valid ELSE token', () => {
			const validateTokens = [
				new Token(tokens.IF_START.name, 0, 10, 'test.length'),
				new Token(tokens.ELSE.name, 0, 10),
				new Token(tokens.IF_END.name, 0, 10)
			];
			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors).to.be.an('array').that.is.empty;
		});

		it('valid ELSE_IF and ELSE tokens', () => {
			const validateTokens = [
				new Token(tokens.IF_START.name, 0, 10, 'test.length'),
				new Token(tokens.ELSE.name, 0, 10, 'otherTest.length'),
				new Token(tokens.ELSE.name, 0, 10, 'array.length'),
				new Token(tokens.ELSE.name, 0, 10),
				new Token(tokens.IF_END.name, 0, 10)
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			expect(validationErrors).to.be.an('array').that.is.empty;
		});

		it('invalid ELSE token missing sibling IF_START', () => {
			const validateTokens = [new Token(tokens.ELSE.name, 0, 10)];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				MISSING_SIBLING_TOKEN,
				validateTokens[0]
			);
		});

		it('invalid ELSE_IF token missing sibling IF_START or ELSE_IF', () => {
			const validateTokens = [
				new Token(tokens.ELSE.name, 0, 10, 'test.length')
			];

			const validator = new Validator(validateTokens);
			const validationErrors = validator.validate();

			validationErrorsCheck(
				validationErrors,
				MISSING_SIBLING_TOKEN,
				validateTokens[0]
			);
		});
	});
});

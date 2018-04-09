const chai = require('chai');
const Expression = require('../../src/model/Expression');
const Unknown = require('../../src/model/Unknown');
const Token = require('../../src/model/Token');
const ValidationError = require('../../src/model/ValidationError');
const { UNKNOWN } = require('../../src/tokens/tokens');

const expect = chai.expect;

const compareStatementTokenState = (
	token,
	expectedTokenName,
	expectedTokenValue,
	isClosing
) => {
	expect(token)
		.to.have.property('name')
		// compare token name
		.that.is.equal(expectedTokenName);

	expect(token)
		.to.have.property('value')
		// compare token value
		.that.is.equal(expectedTokenValue);

	expect(token)
		.to.have.property('isClosing')
		// compare token value
		.that.is.equal(isClosing);
};

const compareExpressionTokenState = (token, expectedExpressionValue) => {
	expect(token)
		.that.is.instanceOf(Expression)
		.that.have.property('value')
		.and.is.equal(expectedExpressionValue);
};

const compareParameterTokenState = (token, expectedExpressionValue) => {
	expect(token)
		.that.is.instanceOf(Expression)
		.that.have.property('value')
		.and.is.equal(expectedExpressionValue);
};

const compareUnknownTokenState = (unknownToken, expectedTokenValue) => {
	expect(unknownToken)
		.to.be.an.instanceOf(Unknown)
		.to.have.property('name')
		// compare token name
		.that.is.equal(UNKNOWN);

	expect(unknownToken)
		.to.have.property('value')
		// compare token value
		.that.is.equal(expectedTokenValue);
};

const compareValidationErrorState = (
	validationError,
	expectedTokenValue,
	expectedErrorCodeValue
) => {
	// error must be instance of ValidationError
	let parseValidatonError = expect(validationError).to.be.instanceOf(
		ValidationError
	);

	// token that could not be parsed
	parseValidatonError.that.have
		.property('token')
		// this can be any token that is child of class Token
		.that.is.an.instanceOf(Token)
		.that.have.property('value')
		.that.is.equal(expectedTokenValue);

	// check if error code is expected one
	parseValidatonError.and.to.have
		.property('errorCode')
		.that.is.equal(expectedErrorCodeValue);
};

module.exports = {
	compareStatementTokenState,
	compareUnknownTokenState,
	compareExpressionTokenState,
	compareParameterTokenState,
	compareValidationErrorState
};

const chai = require('chai');
const Expression = require('../../src/model/Expression');
const expect = chai.expect;

const compareTokenState = (
	token,
	expectedStartPosition,
	expectedEndPosition,
	expectedTokenName,
	expectedStatement
) => {
	expect(token)
		.to.have.property('startPosition')
		// compare token start postion in text
		.that.is.equal(expectedStartPosition);
	expect(token)
		.to.have.property('endPosition')
		// compare token end postion in text
		.that.is.equal(expectedEndPosition);
	expect(token)
		.to.have.property('name')
		// compare token name
		.that.is.equal(expectedTokenName);
	expect(token)
		.to.have.property('expression')
		.that.is.instanceOf(Expression)
		.that.have.property('value')
		.and.is.equal(expectedStatement);
};

module.exports = {
	compareTokenState
};

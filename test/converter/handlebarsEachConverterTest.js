const chai = require('chai');
const path = require('path');
const HandlebarsConverter = require('../../src/converter/handlerbars/HandlebarsConverter');
const tokens = require('../../src/tokens/tokens');
const {
	compareStatementTokenState,
	compareUnknownTokenState,
	compareExpressionTokenState
} = require('../utils/utils');
const ValidationError = require('../../src/model/ValidationError');
const { CONVERT_ERROR } = require('../../src/model/error_code');

const expect = chai.expect;

const convertTemplate = (templatePath, done) =>
	this.handlebarsConverter.convert([templatePath]).catch(e => done(e));

describe('Test handlebars EACH converter', () => {
	beforeEach(done => {
		this.handlebarsConverter = new HandlebarsConverter();
		const templatePath = path.resolve(
			__dirname,
			'./templates/eachStatement.html'
		);

		convertTemplate(templatePath, done).then(() => {
			let convertedTemplates = this.handlebarsConverter.convertTemplates;
			expect(convertedTemplates)
				.to.be.an('array')
				.that.have.lengthOf(4);

			this.convertedTemplates = convertedTemplates;
			done();
		});
	});

	describe('Test convert simple EACH statement', () => {
		beforeEach(() => {
			this.tokenNodes = this.convertedTemplates[0].tokenNodes;
		});

		it('Check EACH nodes', () => {
			expect(this.tokenNodes)
				.that.is.an('array')
				.that.have.lengthOf(1);

			let eachToken = this.tokenNodes[0].token;
			compareStatementTokenState(eachToken, tokens.EACH, '#each', false);
			compareExpressionTokenState(eachToken.expression, 'collection');
		});

		it('Check EACH statement index and value', () => {
			let eachNode = this.tokenNodes[0];

			// we have 2 expression tokens and 2 unknown tokens in template
			expect(eachNode.children)
				.to.be.an('array')
				.that.have.lengthOf(4);

			expect(eachNode.siblings).to.be.an('array').that.is.empty;

			// check if index expression is converted
			let indexExpression = eachNode.children[0].token;
			compareExpressionTokenState(indexExpression, '@index');

			// check if value expression is converted
			let valueExpression = eachNode.children[2].token;
			compareExpressionTokenState(valueExpression, 'this');
		});

		it('Check EACH statement unknown tokens', () => {
			let eachNode = this.tokenNodes[0];

			// we have 2 expression tokens and 2 unknown tokens in template
			expect(eachNode.children)
				.to.be.an('array')
				.that.have.lengthOf(4);

			expect(eachNode.siblings).to.be.an('array').that.is.empty;

			let firstUnknownToken = eachNode.children[1].token;
			compareUnknownTokenState(firstUnknownToken, ': <em>');

			let secondUnknownToken = eachNode.children[3].token;
			compareUnknownTokenState(secondUnknownToken, '. </em>');
		});

		it('Check complex each nodes', () => {});
	});

	describe('Test convert complex EACH statement', () => {
		beforeEach(() => {
			this.tokenNodes = this.convertedTemplates[1].tokenNodes;
		});

		it('Check EACH nodes', () => {
			expect(this.tokenNodes)
				.that.is.an('array')
				.that.have.lengthOf(1);

			let eachToken = this.tokenNodes[0].token;
			compareStatementTokenState(eachToken, tokens.EACH, '#each', false);
			compareExpressionTokenState(eachToken.expression, 'collection');
		});

		it('Check EACH statement index and value', () => {
			let eachNode = this.tokenNodes[0];

			// we have 2 expression tokens and 2 unknown tokens in template
			expect(eachNode.children)
				.to.be.an('array')
				.that.have.lengthOf(4);

			expect(eachNode.siblings).to.be.an('array').that.is.empty;

			// check if index expression is converted
			let indexExpression = eachNode.children[0].token;
			compareExpressionTokenState(indexExpression, '@index');

			// check if value expression is converted
			let valueExpression = eachNode.children[2].token;
			compareExpressionTokenState(valueExpression, 'this');
		});

		it('Check EACH statement unknown tokens', () => {
			let eachNode = this.tokenNodes[0];

			// we have 2 expression tokens and 2 unknown tokens in template
			expect(eachNode.children)
				.to.be.an('array')
				.that.have.lengthOf(4);

			expect(eachNode.siblings).to.be.an('array').that.is.empty;

			let firstUnknownToken = eachNode.children[1].token;
			compareUnknownTokenState(firstUnknownToken, ': <em>');

			let secondUnknownToken = eachNode.children[3].token;
			compareUnknownTokenState(secondUnknownToken, '. </em>');
		});

		it('Check complex each nodes', () => {});
	});

	describe('Test convert complex EACH statement with nested if', () => {
		beforeEach(() => {
			this.tokenNodes = this.convertedTemplates[2].tokenNodes;
		});

		it('Check EACH nodes', () => {
			expect(this.tokenNodes)
				.that.is.an('array')
				.that.have.lengthOf(1);

			let eachToken = this.tokenNodes[0].token;
			compareStatementTokenState(eachToken, tokens.EACH, '#each', false);
			compareExpressionTokenState(eachToken.expression, 'collection');
		});

		it('Check IF statement inside ELSE statement', () => {
			let eachNode = this.tokenNodes[0];

			// we have 2 expression tokens and 2 unknown tokens in template
			expect(eachNode.children)
				.to.be.an('array')
				.that.have.lengthOf(1);

			let ifToken = eachNode.children[0].token;
			compareStatementTokenState(ifToken, tokens.IF, '#if', false);
			compareExpressionTokenState(ifToken.expression, 'this');
		});
	});

	describe('Test convert complex EACH statement with function call', () => {
		beforeEach(() => {
			this.templateModel = this.convertedTemplates[3];
			this.tokenNodes = this.templateModel.tokenNodes;
		});

		it('Check convert errors', () => {
			expect(this.templateModel.errors)
				.to.be.an('array')
				.that.have.lengthOf(1);

			let paramsError = this.templateModel.errors[0];
			expect(paramsError)
				.to.be.instanceOf(ValidationError)
				.that.have.property('errorCode')
				.that.is.equal(CONVERT_ERROR.code);
		});

		it('Check EACH nodes', () => {
			expect(this.tokenNodes)
				.that.is.an('array')
				.that.have.lengthOf(1);

			let eachToken = this.tokenNodes[0].token;
			compareStatementTokenState(eachToken, tokens.EACH, '#each', false);
			compareExpressionTokenState(
				eachToken.expression,
				'$item.getCollection()'
			);
		});
	});
});

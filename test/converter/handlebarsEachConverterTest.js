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
const {
	CONVERT_CHECK_IS_REQUIRED,
	INVALID_EXPRESSION_TYPE
} = require('../../src/model/error_code');
const TemplateParser = require('../../src/parser/TemplateParser');

const expect = chai.expect;

const convertTemplate = (templatePath, done) => {
	// let jquery template parse all file from paths and create template models
	let templateParser = new TemplateParser([templatePath], {
		removeTabs: true
	});
	// parse all templates
	return templateParser
		.parse()
		.then(() => {
			this.handlebarsConverter.convert(templateParser.templates);
		})
		.catch(e => done(e));
};

describe('Test handlebars EACH converter', () => {
	beforeEach(done => {
		this.handlebarsConverter = new HandlebarsConverter({
			output: '/'
		});
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
				.that.have.lengthOf(5);

			expect(eachNode.siblings).to.be.an('array').that.is.empty;

			// check if index expression is converted
			let indexExpression = eachNode.children[1].token;
			compareExpressionTokenState(indexExpression, '@index');

			// check if value expression is converted
			let valueExpression = eachNode.children[3].token;
			compareExpressionTokenState(valueExpression, 'this');
		});

		it('Check EACH statement unknown tokens', () => {
			let eachNode = this.tokenNodes[0];

			// we have 2 expression tokens and 3 unknown tokens in template
			expect(eachNode.children)
				.to.be.an('array')
				.that.have.lengthOf(5);

			expect(eachNode.siblings).to.be.an('array').that.is.empty;

			let firstUnknownToken = eachNode.children[2].token;
			compareUnknownTokenState(firstUnknownToken, ': <em>');

			let secondUnknownToken = eachNode.children[4].token;
			compareUnknownTokenState(secondUnknownToken, '. </em>\n');
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
			compareExpressionTokenState(
				eachToken.expression,
				'collection as |myValue myIndex|'
			);
		});

		it('Check EACH statement index and value', () => {
			let eachNode = this.tokenNodes[0];

			// we have 2 expression tokens and 2 unknown tokens in template
			expect(eachNode.children)
				.to.be.an('array')
				.that.have.lengthOf(5);

			expect(eachNode.siblings).to.be.an('array').that.is.empty;

			// check if index expression is converted
			let indexExpression = eachNode.children[1].token;
			compareExpressionTokenState(indexExpression, 'myIndex');

			// check if value expression is converted
			let valueExpression = eachNode.children[3].token;
			compareExpressionTokenState(valueExpression, 'myValue');
		});

		it('Check EACH statement unknown tokens', () => {
			let eachNode = this.tokenNodes[0];

			// we have 2 expression tokens and 3 unknown tokens in template
			expect(eachNode.children)
				.to.be.an('array')
				.that.have.lengthOf(5);

			expect(eachNode.siblings).to.be.an('array').that.is.empty;

			let firstUnknownToken = eachNode.children[2].token;
			compareUnknownTokenState(firstUnknownToken, ': <em>');

			let secondUnknownToken = eachNode.children[4].token;
			compareUnknownTokenState(secondUnknownToken, '. </em>\n');
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
			compareExpressionTokenState(
				eachToken.expression,
				'collection as |myValue myIndex|'
			);
		});

		it('Check IF statement inside ELSE statement', () => {
			let eachNode = this.tokenNodes[0];

			// we have 2 unknown tokens that are only new line
			expect(eachNode.children)
				.to.be.an('array')
				.that.have.lengthOf(3);

			let ifToken = eachNode.children[1].token;
			compareStatementTokenState(ifToken, tokens.IF, '#if', false);
			compareExpressionTokenState(ifToken.expression, 'myValue');
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
				.that.have.lengthOf(3);

			// 3 errors
			// for convert from $item to this
			// named parameters check warning
			// error for function call in expression
			expect(this.templateModel.errors[0])
				.to.be.instanceOf(ValidationError)
				.that.have.property('code')
				.that.is.equal(CONVERT_CHECK_IS_REQUIRED.code);

			expect(this.templateModel.errors[1])
				.to.be.instanceOf(ValidationError)
				.that.have.property('code')
				.that.is.equal(INVALID_EXPRESSION_TYPE.code);

			expect(this.templateModel.errors[2])
				.to.be.instanceOf(ValidationError)
				.that.have.property('code')
				.that.is.equal(CONVERT_CHECK_IS_REQUIRED.code);
		});

		it('Check EACH nodes', () => {
			expect(this.tokenNodes)
				.that.is.an('array')
				.that.have.lengthOf(1);

			let eachToken = this.tokenNodes[0].token;
			compareStatementTokenState(eachToken, tokens.EACH, '#each', false);
			compareExpressionTokenState(
				eachToken.expression,
				'this.getCollection() as |myValue myIndex|'
			);
		});
	});
});

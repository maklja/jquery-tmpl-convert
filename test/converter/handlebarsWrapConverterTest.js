const chai = require('chai');
const path = require('path');
const HandlebarsConverter = require('../../src/converter/handlerbars/HandlebarsConverter');
const tokens = require('../../src/tokens/tokens');
const {
	compareStatementTokenState,
	compareExpressionTokenState
} = require('../utils/utils');
const ValidationError = require('../../src/model/ValidationError');
const { CONVERT_ERROR } = require('../../src/model/error_code');
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

describe('Test handlebars WRAP converter', () => {
	beforeEach(done => {
		this.handlebarsConverter = new HandlebarsConverter({
			output: '/'
		});

		const templatePath = path.resolve(
			__dirname,
			'./templates/wrapStatement.html'
		);

		convertTemplate(templatePath, done).then(() => {
			let convertedTemplates = this.handlebarsConverter.convertTemplates;
			expect(convertedTemplates)
				.to.be.an('array')
				.that.have.lengthOf(3);

			this.convertedTemplates = convertedTemplates;
			done();
		});
	});

	describe('Test convert simple WRAP statement', () => {
		beforeEach(() => {
			this.templateModel = this.convertedTemplates[0];
			this.tokenNodes = this.templateModel.tokenNodes;
		});

		it('Check convert errors', () => {
			expect(this.templateModel.errors)
				.to.be.an('array')
				.that.have.lengthOf(2);

			let unsupportedFullConvertError = this.templateModel.errors[0];
			expect(unsupportedFullConvertError)
				.to.be.instanceOf(ValidationError)
				.that.have.property('code')
				.that.is.equal(CONVERT_ERROR.code);

			let error = this.templateModel.errors[1];
			expect(error)
				.to.be.instanceOf(ValidationError)
				.that.have.property('code')
				.that.is.equal(CONVERT_ERROR.code);
		});

		it('Check if both opening and closing nodes are present', () => {
			expect(this.tokenNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);
		});

		it('Check TMPL node', () => {
			let wrapToken = this.tokenNodes[0].token;
			compareStatementTokenState(
				wrapToken,
				tokens.WRAP,
				'#> previewTemplate',
				false
			);

			expect(wrapToken.expression).to.be.null;
		});

		it('Check WRAP closing node', () => {
			let wrapToken = this.tokenNodes[0].closingToken;
			compareStatementTokenState(
				wrapToken,
				tokens.WRAP,
				'previewTemplate',
				true
			);

			expect(wrapToken.expression).to.be.null;
		});
	});

	describe('Test convert complex WRAP statement', () => {
		beforeEach(() => {
			this.templateModel = this.convertedTemplates[1];
			this.tokenNodes = this.convertedTemplates[1].tokenNodes;
		});

		it('Check convert errors', () => {
			expect(this.templateModel.errors)
				.to.be.an('array')
				.that.have.lengthOf(3);

			let unsupportedFullConvertError = this.templateModel.errors[0];
			expect(unsupportedFullConvertError)
				.to.be.instanceOf(ValidationError)
				.that.have.property('code')
				.that.is.equal(CONVERT_ERROR.code);

			let paramsError = this.templateModel.errors[1];
			expect(paramsError)
				.to.be.instanceOf(ValidationError)
				.that.have.property('code')
				.that.is.equal(CONVERT_ERROR.code);

			let registerTemplateError = this.templateModel.errors[2];
			expect(registerTemplateError)
				.to.be.instanceOf(ValidationError)
				.that.have.property('code')
				.that.is.equal(CONVERT_ERROR.code);
		});

		it('Check if both opening and closing nodes are present', () => {
			expect(this.tokenNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);
		});

		it('Check WRAP nodes', () => {
			let wrapToken = this.tokenNodes[0].token;
			compareStatementTokenState(
				wrapToken,
				tokens.WRAP,
				'#> previewTemplate',
				false
			);

			compareExpressionTokenState(
				wrapToken.expression,
				'param1=data param2=helpFunc'
			);
		});

		it('Check WRAP closing node', () => {
			let wrapToken = this.tokenNodes[0].closingToken;
			compareStatementTokenState(
				wrapToken,
				tokens.WRAP,
				'previewTemplate',
				true
			);

			expect(wrapToken.expression).to.be.null;
		});
	});
});

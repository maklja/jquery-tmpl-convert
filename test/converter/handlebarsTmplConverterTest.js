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

describe('Test handlebars TMPL converter', () => {
	beforeEach(done => {
		this.handlebarsConverter = new HandlebarsConverter({
			outputDir: '/'
		});

		const templatePath = path.resolve(
			__dirname,
			'./templates/tmplStatement.html'
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

	describe('Test convert simple TMPL statement', () => {
		beforeEach(() => {
			this.templateModel = this.convertedTemplates[0];
			this.tokenNodes = this.templateModel.tokenNodes;
		});

		it('Check convert errors', () => {
			expect(this.templateModel.errors)
				.to.be.an('array')
				.that.have.lengthOf(1);

			let error = this.templateModel.errors[0];
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
			let tmplToken = this.tokenNodes[0].token;
			compareStatementTokenState(
				tmplToken,
				tokens.TMPL,
				'#> languageTemplate',
				false
			);

			expect(tmplToken.expression).to.be.null;
		});

		it('Check TMPL closing node', () => {
			let tmplToken = this.tokenNodes[0].closingToken;
			compareStatementTokenState(
				tmplToken,
				tokens.TMPL,
				'languageTemplate',
				true
			);

			expect(tmplToken.expression).to.be.null;
		});
	});

	describe('Test convert complex TMPL statement', () => {
		beforeEach(() => {
			this.templateModel = this.convertedTemplates[1];
			this.tokenNodes = this.convertedTemplates[1].tokenNodes;
		});

		it('Check convert errors', () => {
			expect(this.templateModel.errors)
				.to.be.an('array')
				.that.have.lengthOf(2);

			let paramsError = this.templateModel.errors[0];
			expect(paramsError)
				.to.be.instanceOf(ValidationError)
				.that.have.property('code')
				.that.is.equal(CONVERT_ERROR.code);

			let registerTemplateError = this.templateModel.errors[1];
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

		it('Check TMPL nodes', () => {
			let tmplToken = this.tokenNodes[0].token;
			compareStatementTokenState(
				tmplToken,
				tokens.TMPL,
				'#> languageTemplate',
				false
			);

			compareExpressionTokenState(
				tmplToken.expression,
				'param1=data param2=helpFunc'
			);
		});

		it('Check TMPL closing node', () => {
			let tmplToken = this.tokenNodes[0].closingToken;
			compareStatementTokenState(
				tmplToken,
				tokens.TMPL,
				'languageTemplate',
				true
			);

			expect(tmplToken.expression).to.be.null;
		});
	});
});

const chai = require('chai');
const path = require('path');
const HandlebarsConverter = require('../../src/converter/handlerbars/HandlebarsConverter');
const tokens = require('../../src/tokens/tokens');
const {
	compareStatementTokenState,
	compareUnknownTokenState
} = require('../utils/utils');
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

describe('Test handlebars HTML converter', () => {
	beforeEach(() => {
		this.handlebarsConverter = new HandlebarsConverter();
	});

	describe('Test convert HTML statement', () => {
		beforeEach(done => {
			const templatePath = path.resolve(
				__dirname,
				'./templates/htmlStatement.html'
			);

			convertTemplate(templatePath, done).then(() => {
				let convertedTemplates = this.handlebarsConverter
					.convertTemplates;
				expect(convertedTemplates)
					.to.be.an('array')
					.that.have.lengthOf(1);

				this.tokenNodes = convertedTemplates[0].tokenNodes;
				done();
			});
		});

		it('Check unknown nodes', () => {
			expect(this.tokenNodes)
				.that.is.an('array')
				.that.have.lengthOf(3);

			let firstUnknownToken = this.tokenNodes[0].token;
			compareUnknownTokenState(firstUnknownToken, '<div>\n');

			let secondUnknownToken = this.tokenNodes[2].token;
			compareUnknownTokenState(secondUnknownToken, '\n</div>');
		});

		it('Check HTML nodes', () => {
			let htmlToken = this.tokenNodes[1].token;
			compareStatementTokenState(
				htmlToken,
				tokens.HTML,
				'item.viewTmpl',
				false
			);

			expect(htmlToken.expression).to.be.null;
		});
	});
});

const chai = require('chai');
const path = require('path');
const HandlebarsConverter = require('../../src/converter/handlerbars/HandlebarsConverter');
const tokens = require('../../src/tokens/tokens');
const {
	compareStatementTokenState,
	compareUnknownTokenState
} = require('../utils/utils');

const expect = chai.expect;

const convertTemplate = (templatePath, done) =>
	this.handlebarsConverter.convert([templatePath]).catch(e => done(e));

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
			compareUnknownTokenState(firstUnknownToken, '<div>');

			let secondUnknownToken = this.tokenNodes[2].token;
			compareUnknownTokenState(secondUnknownToken, '</div>');
		});

		it('Check HTML nodes', () => {
			let htmlToken = this.tokenNodes[1].token;
			compareStatementTokenState(
				htmlToken,
				tokens.HTML,
				'{item.viewTmpl}',
				false
			);

			expect(htmlToken.expression).to.be.null;
		});
	});
});

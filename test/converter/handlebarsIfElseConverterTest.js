const chai = require('chai');
const path = require('path');
const HandlebarsConverter = require('../../src/converter/handlerbars/HandlebarsConverter');
const tokens = require('../../src/tokens/tokens');
const {
	compareStatementTokenState,
	compareUnknownTokenState,
	compareExpressionTokenState
} = require('../utils/utils');

const expect = chai.expect;

const convertTemplate = (templatePath, done) =>
	this.handlebarsConverter.convert([templatePath]).catch(e => done(e));

describe('Test handlebars IF ELSE converter', () => {
	beforeEach(() => {
		this.handlebarsConverter = new HandlebarsConverter();
	});

	describe('Test convert simple IF - ELSE IF - ELSE statement', () => {
		beforeEach(done => {
			const templatePath = path.resolve(
				__dirname,
				'./templates/IfElseStatement.html'
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

		it('check IF statement node', () => {
			let convertedNodes = this.tokenNodes;
			expect(convertedNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);

			let ifNode = convertedNodes[0],
				// first check if start token is converted
				ifStartToken = ifNode.token;
			compareStatementTokenState(ifStartToken, tokens.IF, '#if', false);

			// check if closing token is converted
			let ifCloseToken = ifNode.closingToken;
			compareStatementTokenState(ifCloseToken, tokens.IF, 'if', true);
		});

		it('check IF statement children', () => {
			// check if children nodes are converted
			let children = this.tokenNodes[0].children;
			expect(children)
				.to.be.an('array')
				.that.have.lengthOf(1);

			let unknownToken = children[0].token;
			compareUnknownTokenState(unknownToken, '<span>Test</span>');
		});

		it('check IF statement siblings', () => {
			// check if children nodes are converted
			let siblings = this.tokenNodes[0].siblings;
			expect(siblings)
				.to.be.an('array')
				.that.have.lengthOf(2);

			let elseIfToken = siblings[0].token;
			compareStatementTokenState(
				elseIfToken,
				tokens.ELSE,
				'else if',
				false
			);

			let elseToken = siblings[1].token;
			compareStatementTokenState(elseToken, tokens.ELSE, 'else', false);
		});

		it('check ELSE IF statement children and siblings', () => {
			// check if children nodes are converted
			let ifNode = this.tokenNodes[0],
				elseIfNode = ifNode.siblings[0],
				children = elseIfNode.children,
				siblings = elseIfNode.siblings;

			expect(children)
				.to.be.an('array')
				.that.have.lengthOf(3);

			expect(siblings).to.be.an('array').that.is.empty;

			let unknownToken = children[0].token;
			compareUnknownTokenState(unknownToken, '<span>');

			let expressionToken = children[1].token;
			compareExpressionTokenState(expressionToken, 'array.length');

			let unknownTokenSec = children[2].token;
			compareUnknownTokenState(unknownTokenSec, '</span>');
		});

		it('check ELSE statement children and siblings', () => {
			// check if children nodes are converted
			let ifNode = this.tokenNodes[0],
				elseNode = ifNode.siblings[1],
				children = elseNode.children,
				siblings = elseNode.siblings;
			expect(children)
				.to.be.an('array')
				.that.have.lengthOf(1);

			expect(siblings).to.be.an('array').that.is.empty;

			let unknownToken = children[0].token;
			compareUnknownTokenState(unknownToken, '<span>OtherTest</span>');
		});
	});
});

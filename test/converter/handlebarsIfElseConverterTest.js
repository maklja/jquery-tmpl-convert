const chai = require('chai');
const path = require('path');
const HandlebarsConverter = require('../../src/converter/handlerbars/HandlebarsConverter');
const tokens = require('../../src/tokens/tokens');
const {
	compareStatementTokenState,
	compareUnknownTokenState,
	compareExpressionTokenState
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

describe('Test handlebars IF ELSE converter', () => {
	beforeEach(() => {
		this.handlebarsConverter = new HandlebarsConverter({
			output: '/'
		});
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
			compareUnknownTokenState(unknownToken, '\n<span>Test</span>\n');
		});

		it('check IF statement siblings', () => {
			// check if children nodes are converted
			let ifNode = this.tokenNodes[0];

			expect(ifNode.siblings)
				.to.be.an('array')
				.that.have.lengthOf(1);

			let elseIfNode = ifNode.siblings[0];
			compareStatementTokenState(
				elseIfNode.token,
				tokens.ELSE,
				'else if',
				false
			);

			let elseNode = elseIfNode.siblings[0];
			compareStatementTokenState(
				elseNode.token,
				tokens.ELSE,
				'else',
				false
			);
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

			expect(siblings)
				.to.be.an('array')
				.that.have.length(1);

			let unknownToken = children[0].token;
			compareUnknownTokenState(unknownToken, '\n<span>');

			let expressionToken = children[1].token;
			compareExpressionTokenState(expressionToken, 'array.length');

			let unknownTokenSec = children[2].token;
			compareUnknownTokenState(unknownTokenSec, '</span>\n');
		});

		it('check ELSE statement children and siblings', () => {
			// check if children nodes are converted
			let ifNode = this.tokenNodes[0],
				elseIfNode = ifNode.siblings[0],
				elseNode = elseIfNode.siblings[0],
				children = elseNode.children,
				siblings = elseNode.siblings;
			expect(children)
				.to.be.an('array')
				.that.have.lengthOf(1);

			expect(siblings).to.be.an('array').that.is.empty;

			let unknownToken = children[0].token;
			compareUnknownTokenState(
				unknownToken,
				'\n<span>OtherTest</span>\n'
			);
		});
	});

	describe('Test convert simple IF !not - ELSE IF !not - ELSE statement', () => {
		beforeEach(done => {
			const templatePath = path.resolve(
				__dirname,
				'./templates/IfNotElseNotStatement.html'
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

		it('check UNLESS statement node', () => {
			let convertedNodes = this.tokenNodes;
			expect(convertedNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);

			let unlessNode = convertedNodes[0],
				// first check if start token is converted
				unlessStartToken = unlessNode.token;
			compareStatementTokenState(
				unlessStartToken,
				tokens.IF,
				'#unless',
				false
			);

			// check if closing token is converted
			let unlessCloseToken = unlessNode.closingToken;
			compareStatementTokenState(
				unlessCloseToken,
				tokens.IF,
				'unless',
				true
			);
		});

		it('check UNLESS statement children', () => {
			// check if children nodes are converted
			let children = this.tokenNodes[0].children;
			expect(children)
				.to.be.an('array')
				.that.have.lengthOf(1);

			let unknownToken = children[0].token;
			compareUnknownTokenState(unknownToken, '\n<span>Test</span>\n');
		});

		it('check UNLESS statement siblings', () => {
			// check if children nodes are converted
			let unlessNode = this.tokenNodes[0];

			expect(unlessNode.siblings)
				.to.be.an('array')
				.that.have.lengthOf(1);

			let elseUnlessNode = unlessNode.siblings[0];
			compareStatementTokenState(
				elseUnlessNode.token,
				tokens.ELSE,
				'else unless',
				false
			);

			let elseNode = elseUnlessNode.siblings[0];
			compareStatementTokenState(
				elseNode.token,
				tokens.ELSE,
				'else',
				false
			);
		});

		it('check ELSE UNLESS statement children and siblings', () => {
			// check if children nodes are converted
			let unlessNode = this.tokenNodes[0],
				elseUnlessNode = unlessNode.siblings[0],
				children = elseUnlessNode.children,
				siblings = elseUnlessNode.siblings;

			expect(children)
				.to.be.an('array')
				.that.have.lengthOf(3);

			expect(siblings)
				.to.be.an('array')
				.that.have.length(1);

			let unknownToken = children[0].token;
			compareUnknownTokenState(unknownToken, '\n<span>');

			let expressionToken = children[1].token;
			compareExpressionTokenState(expressionToken, 'array.length');

			let unknownTokenSec = children[2].token;
			compareUnknownTokenState(unknownTokenSec, '</span>\n');
		});

		it('check ELSE statement children and siblings', () => {
			// check if children nodes are converted
			let unlessNode = this.tokenNodes[0],
				elseUnlessNode = unlessNode.siblings[0],
				elseNode = elseUnlessNode.siblings[0],
				children = elseNode.children,
				siblings = elseNode.siblings;
			expect(children)
				.to.be.an('array')
				.that.have.lengthOf(1);

			expect(siblings).to.be.an('array').that.is.empty;

			let unknownToken = children[0].token;
			compareUnknownTokenState(
				unknownToken,
				'\n<span>OtherTest</span>\n'
			);
		});
	});
});

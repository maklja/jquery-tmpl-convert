const chai = require('chai');

const expect = chai.expect;
const NodeTreeMaker = require('../../src/rules/NodeTreeMaker');
const Token = require('../../src/model/Token');
const tokens = require('../../src/tokens/tokens');

describe('Node Tree Maker', function() {
	describe('Test IF token tree making', function() {
		it('IF node', function() {
			const ifStartToken = new Token(tokens.IF_START.name, 0, 0, null);
			const ifEndToken = new Token(tokens.IF_END.name, 0, 0);
			const validateTokens = [ifStartToken, ifEndToken];

			const nodeTreeMaker = new NodeTreeMaker(validateTokens);
			const treeNodes = nodeTreeMaker.createTree();

			expect(treeNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);

			const ifNode = treeNodes[0];
			expect(ifNode)
				.to.have.property('token')
				.that.is.deep.equal(ifStartToken);
			expect(ifNode)
				.to.have.property('closingToken')
				.that.is.deep.equal(ifEndToken);
			expect(ifNode)
				.to.have.property('children')
				.to.be.an('array').that.is.empty;
			expect(ifNode)
				.to.have.property('siblings')
				.to.be.an('array').that.is.empty;
		});

		it('IF - ELSE node', function() {
			const ifStartToken = new Token(tokens.IF_START.name, 0, 0, null);
			const elseToken = new Token(tokens.ELSE.name, 0, 0, null);
			const ifEndToken = new Token(tokens.IF_END.name, 0, 0);
			const validateTokens = [ifStartToken, elseToken, ifEndToken];

			const nodeTreeMaker = new NodeTreeMaker(validateTokens);
			const treeNodes = nodeTreeMaker.createTree();

			expect(treeNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);

			// check if node
			const ifNode = treeNodes[0];
			expect(ifNode)
				.to.have.property('token')
				.that.is.deep.equal(ifStartToken);
			expect(ifNode)
				.to.have.property('closingToken')
				.that.is.deep.equal(ifEndToken);
			expect(ifNode)
				.to.have.property('children')
				.to.be.an('array').that.is.empty;
			expect(ifNode)
				.to.have.property('siblings')
				.to.be.an('array')
				.that.have.lengthOf(1);

			// check else node
			const elseNode = ifNode.siblings[0];
			expect(elseNode)
				.to.have.property('token')
				.that.is.deep.equal(elseToken);
			expect(elseNode).to.have.property('closingToken').that.is.undefined;
			expect(elseNode)
				.to.have.property('children')
				.to.be.an('array').that.is.empty;
			expect(elseNode)
				.to.have.property('siblings')
				.to.be.an('array').that.is.empty;
		});

		it('IF - ELSE IF - ELSE node', function() {
			const ifStartToken = new Token(tokens.IF_START.name, 0, 0, null);
			const elseIfToken = new Token(tokens.ELSE_IF.name, 0, 0, null);
			const elseToken = new Token(tokens.ELSE.name, 0, 0, null);
			const ifEndToken = new Token(tokens.IF_END.name, 0, 0);
			const validateTokens = [
				ifStartToken,
				elseIfToken,
				elseToken,
				ifEndToken
			];

			const nodeTreeMaker = new NodeTreeMaker(validateTokens);
			const treeNodes = nodeTreeMaker.createTree();

			expect(treeNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);

			// check if node
			const ifNode = treeNodes[0];
			expect(ifNode)
				.to.have.property('token')
				.that.is.deep.equal(ifStartToken);
			expect(ifNode)
				.to.have.property('closingToken')
				.that.is.deep.equal(ifEndToken);
			expect(ifNode)
				.to.have.property('children')
				.to.be.an('array').that.is.empty;
			expect(ifNode)
				.to.have.property('siblings')
				.to.be.an('array')
				.that.have.lengthOf(2);

			// check else node
			const elseIfNode = ifNode.siblings[0];
			expect(elseIfNode)
				.to.have.property('token')
				.that.is.deep.equal(elseIfToken);
			expect(elseIfNode).to.have.property('closingToken').that.is
				.undefined;
			expect(elseIfNode)
				.to.have.property('children')
				.to.be.an('array').that.is.empty;
			expect(elseIfNode)
				.to.have.property('siblings')
				.to.be.an('array').that.is.empty;

			// check else node
			const elseNode = ifNode.siblings[1];
			expect(elseNode)
				.to.have.property('token')
				.that.is.deep.equal(elseToken);
			expect(elseNode).to.have.property('closingToken').that.is.undefined;
			expect(elseNode)
				.to.have.property('children')
				.to.be.an('array').that.is.empty;
			expect(elseNode)
				.to.have.property('siblings')
				.to.be.an('array').that.is.empty;
		});
	});

	describe('Test EACH token tree making', function() {
		it('EACH node', function() {
			const eachStartToken = new Token(
				tokens.EACH_START.name,
				0,
				0,
				null
			);
			const eachEndToken = new Token(tokens.EACH_END.name, 0, 0);
			const validateTokens = [eachStartToken, eachEndToken];

			const nodeTreeMaker = new NodeTreeMaker(validateTokens);
			const treeNodes = nodeTreeMaker.createTree();

			expect(treeNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);

			const eachNode = treeNodes[0];
			expect(eachNode)
				.to.have.property('token')
				.that.is.deep.equal(eachStartToken);
			expect(eachNode)
				.to.have.property('closingToken')
				.that.is.deep.equal(eachEndToken);
			expect(eachNode)
				.to.have.property('children')
				.to.be.an('array').that.is.empty;
			expect(eachNode)
				.to.have.property('siblings')
				.to.be.an('array').that.is.empty;
		});
	});

	describe('Test WRAP token tree making', function() {
		it('WRAP node', function() {
			const wrapStartToken = new Token(
				tokens.WRAP_START.name,
				0,
				0,
				null
			);
			const wrapEndToken = new Token(tokens.WRAP_END.name, 0, 0);
			const validateTokens = [wrapStartToken, wrapEndToken];

			const nodeTreeMaker = new NodeTreeMaker(validateTokens);
			const treeNodes = nodeTreeMaker.createTree();

			expect(treeNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);

			const eachNode = treeNodes[0];
			expect(eachNode)
				.to.have.property('token')
				.that.is.deep.equal(wrapStartToken);
			expect(eachNode)
				.to.have.property('closingToken')
				.that.is.deep.equal(wrapEndToken);
			expect(eachNode)
				.to.have.property('children')
				.to.be.an('array').that.is.empty;
			expect(eachNode)
				.to.have.property('siblings')
				.to.be.an('array').that.is.empty;
		});
	});

	describe('Test other tokens', function() {
		const testNodeState = token => {
			const validateTokens = [token];
			const nodeTreeMaker = new NodeTreeMaker(validateTokens);
			const treeNodes = nodeTreeMaker.createTree();

			expect(treeNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);

			const varNode = treeNodes[0];
			expect(varNode)
				.to.have.property('token')
				.that.is.deep.equal(validateTokens[0]);
			expect(varNode).to.have.property('closingToken').that.is.undefined;
			expect(varNode).to.have.property('children').that.is.empty;
			expect(varNode).to.have.property('siblings').that.is.empty;
		};

		it('VAR node', function() {
			testNodeState(new Token(tokens.VAR.name, 0, 0, 'test'));
		});

		it('UNKOWN node', function() {
			testNodeState(new Token(tokens.UNKNOWN.name, 0, 0, 'test//test'));
		});

		it('HTML node', function() {
			testNodeState(
				new Token(tokens.HTML.name, 0, 0, '<span>Test</span>')
			);
		});

		it('TMPL node', function() {
			testNodeState(new Token(tokens.TMPL.name, 0, 0, '#otherTmpl'));
		});
	});

	describe('Complex token structure', function() {
		const unknowTokenBetween = (startToken, endToken) => {
			const unknownToken = new Token(tokens.UNKNOWN.name, 0, 0);
			const validateTokens = [startToken, unknownToken, endToken];

			const nodeTreeMaker = new NodeTreeMaker(validateTokens);
			const treeNodes = nodeTreeMaker.createTree();

			expect(treeNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);

			const ifNode = treeNodes[0];
			expect(ifNode)
				.to.have.property('token')
				.that.is.deep.equal(startToken);
			expect(ifNode)
				.to.have.property('closingToken')
				.that.is.deep.equal(endToken);
			expect(ifNode).to.have.property('siblings').that.is.empty;

			expect(ifNode)
				.to.have.property('children')
				.to.be.an('array')
				.that.have.lengthOf(1);
		};

		it('UNKNOWN token inside IF', function() {
			const ifStartToken = new Token(tokens.IF_START.name, 0, 0, null);
			const ifEndToken = new Token(tokens.IF_END.name, 0, 0);

			unknowTokenBetween(ifStartToken, ifEndToken);
		});

		it('UNKNOWN token inside EACH', function() {
			const eachStartToken = new Token(
				tokens.EACH_START.name,
				0,
				0,
				null
			);
			const eachEndToken = new Token(tokens.EACH_END.name, 0, 0);

			unknowTokenBetween(eachStartToken, eachEndToken);
		});

		it('UNKNOWN token inside WRAO', function() {
			const wrapStartToken = new Token(
				tokens.WRAP_START.name,
				0,
				0,
				null
			);
			const wrapEndToken = new Token(tokens.WRAP_END.name, 0, 0);

			unknowTokenBetween(wrapStartToken, wrapEndToken);
		});

		const testOuterAndInnerClosingToken = (
			outherStartToken,
			outherEndToken,
			innerStartToken,
			innerEndToken
		) => {
			const validateTokens = [
				outherStartToken,
				innerStartToken,
				innerEndToken,
				outherEndToken
			];

			const nodeTreeMaker = new NodeTreeMaker(validateTokens);
			const treeNodes = nodeTreeMaker.createTree();

			expect(treeNodes)
				.to.be.an('array')
				.that.have.lengthOf(1);

			// outher node
			const outherNode = treeNodes[0];
			expect(outherNode)
				.to.have.property('token')
				.that.is.deep.equal(outherStartToken);
			expect(outherNode)
				.to.have.property('closingToken')
				.that.is.deep.equal(outherEndToken);
			expect(outherNode).to.have.property('siblings').that.is.empty;
			expect(outherNode)
				.to.have.property('children')
				.to.be.an('array')
				.that.have.lengthOf(1);

			// inner node
			const innerNode = outherNode.children[0];
			expect(innerNode)
				.to.have.property('token')
				.that.is.deep.equal(innerStartToken);
			expect(innerNode)
				.to.have.property('closingToken')
				.that.is.deep.equal(innerEndToken);
			expect(innerNode).to.have.property('siblings').that.is.empty;
			expect(innerNode).to.have.property('children').that.is.empty;
		};

		it('IF token inside EACH', function() {
			const ifStartToken = new Token(tokens.IF_START.name, 0, 0, null);
			const ifEndToken = new Token(tokens.IF_END.name, 0, 0);
			const eachStartToken = new Token(
				tokens.EACH_START.name,
				0,
				0,
				null
			);
			const eachEndToken = new Token(tokens.EACH_END.name, 0, 0);
			testOuterAndInnerClosingToken(
				eachStartToken,
				eachEndToken,
				ifStartToken,
				ifEndToken
			);
		});

		it('WRAP token inside EACH', function() {
			const wrapStartToken = new Token(
				tokens.WRAP_START.name,
				0,
				0,
				null
			);
			const wrapEndToken = new Token(tokens.WRAP_END.name, 0, 0);
			const eachStartToken = new Token(
				tokens.EACH_START.name,
				0,
				0,
				null
			);
			const eachEndToken = new Token(tokens.EACH_END.name, 0, 0);
			testOuterAndInnerClosingToken(
				eachStartToken,
				eachEndToken,
				wrapStartToken,
				wrapEndToken
			);
		});

		it('IF token inside IF', function() {
			const ifInnerStartToken = new Token(
				tokens.IF_START.name,
				0,
				0,
				null
			);
			const ifInnerEndToken = new Token(tokens.IF_END.name, 0, 0);
			const ifOuterStartToken = new Token(
				tokens.IF_START.name,
				0,
				0,
				null
			);
			const ifOuterEndToken = new Token(tokens.IF_END.name, 0, 0);
			testOuterAndInnerClosingToken(
				ifOuterStartToken,
				ifOuterEndToken,
				ifInnerStartToken,
				ifInnerEndToken
			);
		});

		it('two root IF tokens', function() {
			const ifStartToken = new Token(tokens.IF_START.name, 0, 0, null);
			const ifEndToken = new Token(tokens.IF_END.name, 0, 0);
			const ifOtherStartToken = new Token(
				tokens.IF_START.name,
				0,
				0,
				null
			);
			const ifOtherEndToken = new Token(tokens.IF_END.name, 0, 0);
			const validateTokens = [
				ifStartToken,
				ifEndToken,
				ifOtherStartToken,
				ifOtherEndToken
			];
			const nodeTreeMaker = new NodeTreeMaker(validateTokens);
			const treeNodes = nodeTreeMaker.createTree();

			expect(treeNodes)
				.to.be.an('array')
				.that.have.lengthOf(2);

			// outher node
			const firstIfNode = treeNodes[0];
			expect(firstIfNode)
				.to.have.property('token')
				.that.is.deep.equal(ifStartToken);
			expect(firstIfNode)
				.to.have.property('closingToken')
				.that.is.deep.equal(ifEndToken);
			expect(firstIfNode).to.have.property('siblings').that.is.empty;
			expect(firstIfNode)
				.to.have.property('children')
				.to.be.an('array').that.is.empty;

			// inner node
			const secondIfNode = treeNodes[1];
			expect(secondIfNode)
				.to.have.property('token')
				.that.is.deep.equal(ifOtherStartToken);
			expect(secondIfNode)
				.to.have.property('closingToken')
				.that.is.deep.equal(ifOtherEndToken);
			expect(secondIfNode).to.have.property('siblings').that.is.empty;
			expect(secondIfNode).to.have.property('children').that.is.empty;
		});
	});
});
// const {
// 	STATMENT_MISSING,
// 	UNEXPECTED_STATMENT,
// 	MISSING_CLOSING_TOKEN,
// 	MISSING_STARTING_TOKEN
// } = require('../../src/rules/error_code');
//
// describe('Rule Matcher test', function() {
// 	describe('test variable rules', function() {
// 		it('valid variable token with statement', function() {
// 			const validateTokens = [
// 				new Token(tokens.VAR.name, 0, 10, 'varName')
// 			];
// 			const ruleMatcher = new RuleMatcher(validateTokens);
// 			const validationErrors = ruleMatcher.validate();
//
// 			expect(validationErrors)
// 				.to.be.an('array')
// 				.that.have.lengthOf(0);
// 		});
//
// 		it('invalid variable token without statement', function() {
// 			const validateTokens = [new Token(tokens.VAR.name, 0, 10, null)];
// 			const ruleMatcher = new RuleMatcher(validateTokens);
// 			const validationErrors = ruleMatcher.validate();
//
// 			expect(validationErrors)
// 				.to.be.an('array')
// 				.that.have.lengthOf(1);
//
// 			const statementMissingValidationError = validationErrors[0];
// 			expect(statementMissingValidationError).to.have.property('message')
// 				.that.is.not.empty;
// 			expect(statementMissingValidationError)
// 				.to.have.property('errorCode')
// 				.that.is.equal(STATMENT_MISSING.code);
// 			expect(statementMissingValidationError)
// 				.to.have.property('token')
// 				.that.is.deep.equal(validateTokens[0]);
// 		});
// 	});
//
// 	describe('test if rules', function() {
// 		it('valid if token with statement', function() {
// 			const validateTokens = [
// 				new Token(tokens.IF_START.name, 0, 10, 'test.length'),
// 				new Token(tokens.IF_END.name, 0, 10)
// 			];
// 			const ruleMatcher = new RuleMatcher(validateTokens);
// 			const validationErrors = ruleMatcher.validate();
//
// 			expect(validationErrors)
// 				.to.be.an('array')
// 				.that.have.lengthOf(0);
// 		});
//
// 		it('invalid if token without statement', function() {
// 			const validateTokens = [
// 				new Token(tokens.IF_START.name, 0, 10, null),
// 				new Token(tokens.IF_END.name, 0, 10)
// 			];
// 			const ruleMatcher = new RuleMatcher(validateTokens);
// 			const validationErrors = ruleMatcher.validate();
//
// 			expect(validationErrors)
// 				.to.be.an('array')
// 				.that.have.lengthOf(1);
//
// 			const statementMissingValidationError = validationErrors[0];
// 			expect(statementMissingValidationError).to.have.property('message')
// 				.that.is.not.empty;
// 			expect(statementMissingValidationError)
// 				.to.have.property('errorCode')
// 				.that.is.equal(STATMENT_MISSING.code);
// 			expect(statementMissingValidationError)
// 				.to.have.property('token')
// 				.that.is.deep.equal(validateTokens[0]);
// 		});
//
// 		it('invalid IF_END token unexpected statement', function() {
// 			const validateTokens = [
// 				new Token(tokens.IF_START.name, 0, 10, 'test.length'),
// 				new Token(tokens.IF_END.name, 0, 10, 'unexpected.statement')
// 			];
//
// 			const ruleMatcher = new RuleMatcher(validateTokens);
// 			const validationErrors = ruleMatcher.validate();
//
// 			expect(validationErrors)
// 				.to.be.an('array')
// 				.that.have.lengthOf(1);
//
// 			const unexpectedStatmentValidationError = validationErrors[0];
// 			expect(unexpectedStatmentValidationError).to.have.property(
// 				'message'
// 			).that.is.not.empty;
// 			expect(unexpectedStatmentValidationError)
// 				.to.have.property('errorCode')
// 				.that.is.equal(UNEXPECTED_STATMENT.code);
// 			expect(unexpectedStatmentValidationError)
// 				.to.have.property('token')
// 				.that.is.deep.equal(validateTokens[1]);
// 		});
//
// 		it("IF_END token doesn't exists", function() {
// 			const validateTokens = [
// 				new Token(tokens.IF_START.name, 0, 10, 'test.length')
// 			];
// 			const ruleMatcher = new RuleMatcher(validateTokens);
// 			const validationErrors = ruleMatcher.validate();
//
// 			expect(validationErrors)
// 				.to.be.an('array')
// 				.that.have.lengthOf(1);
//
// 			const unexpectedStatmentValidationError = validationErrors[0];
// 			expect(unexpectedStatmentValidationError).to.have.property(
// 				'message'
// 			).that.is.not.empty;
// 			expect(unexpectedStatmentValidationError)
// 				.to.have.property('errorCode')
// 				.that.is.equal(MISSING_CLOSING_TOKEN.code);
// 			expect(unexpectedStatmentValidationError)
// 				.to.have.property('token')
// 				.that.is.deep.equal(validateTokens[0]);
// 		});
//
// 		it('IF_START token does not exists', function() {
// 			const validateTokens = [new Token(tokens.IF_END.name, 0, 10)];
//
// 			const ruleMatcher = new RuleMatcher(validateTokens);
// 			const validationErrors = ruleMatcher.validate();
//
// 			expect(validationErrors)
// 				.to.be.an('array')
// 				.that.have.lengthOf(1);
//
// 			const unexpectedStatmentValidationError = validationErrors[0];
// 			expect(unexpectedStatmentValidationError).to.have.property(
// 				'message'
// 			).that.is.not.empty;
// 			expect(unexpectedStatmentValidationError)
// 				.to.have.property('errorCode')
// 				.that.is.equal(MISSING_STARTING_TOKEN.code);
// 			expect(unexpectedStatmentValidationError)
// 				.to.have.property('token')
// 				.that.is.deep.equal(validateTokens[0]);
// 		});
// 	});
// });

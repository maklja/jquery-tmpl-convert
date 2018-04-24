const chai = require('chai');

const expect = chai.expect;
const NodeTreeMaker = require('../../src/nodes/NodeTreeMaker');
const Expression = require('../../src/model/Expression');
const Statement = require('../../src/model/Statement');
const Unknown = require('../../src/model/Unknown');
const {
	WRAP,
	EACH,
	IF,
	ELSE,
	HTML,
	TMPL,
	findStatementTokenPatternByName
} = require('../../src/tokens/tokens');

describe('Node Tree Maker', () => {
	describe('Test IF token tree making', () => {
		it('IF node', () => {
			const ifStartToken = new Statement(
				IF,
				'if',
				null,
				new Expression('test.length', null),
				false,
				null,
				findStatementTokenPatternByName(IF)
			);
			const ifEndToken = new Statement(
				IF,
				'if',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(IF, true)
			);
			const tokens = [ifStartToken, ifEndToken];

			const nodeTreeMaker = new NodeTreeMaker(tokens);
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

		it('IF - ELSE node', () => {
			const ifStartToken = new Statement(
				IF,
				'if',
				null,
				new Expression('test.length', null),
				false,
				null,
				findStatementTokenPatternByName(IF)
			);
			const elseToken = new Statement(
				ELSE,
				'else',
				null,
				null,
				false,
				null,
				findStatementTokenPatternByName(ELSE)
			);
			const ifEndToken = new Statement(
				IF,
				'if',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(IF, true)
			);
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

		it('IF - ELSE IF - ELSE node', () => {
			const ifStartToken = new Statement(
				IF,
				'if',
				null,
				new Expression('test.length', null),
				false,
				null,
				findStatementTokenPatternByName(IF)
			);
			const elseIfToken = new Statement(
				ELSE,
				'else',
				null,
				new Expression('otherTest.length', null),
				false,
				null,
				findStatementTokenPatternByName(ELSE)
			);
			const elseToken = new Statement(
				ELSE,
				'else',
				null,
				null,
				false,
				null,
				findStatementTokenPatternByName(ELSE)
			);
			const ifEndToken = new Statement(
				IF,
				'if',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(IF, true)
			);
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
				.that.have.lengthOf(1);

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
				.to.be.an('array')
				.that.have.length(1);

			// check else node
			const elseNode = elseIfNode.siblings[0];
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

	describe('Test EACH token tree making', () => {
		it('EACH node', () => {
			const eachStartToken = new Statement(
				EACH,
				'each',
				null,
				new Expression('test.length', null),
				false,
				null,
				findStatementTokenPatternByName(EACH)
			);
			const eachEndToken = new Statement(
				EACH,
				'each',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(EACH, true)
			);
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

	describe('Test WRAP token tree making', () => {
		it('WRAP node', () => {
			const wrapStartToken = new Statement(
				WRAP,
				'wrap',
				null,
				new Expression('#test', null),
				false,
				null,
				findStatementTokenPatternByName(WRAP)
			);
			const wrapEndToken = new Statement(
				WRAP,
				'wrap',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(WRAP, true)
			);
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

	describe('Test other tokens', () => {
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

		it('VAR node', () => {
			testNodeState(new Expression('test'));
		});

		it('UNKOWN node', () => {
			testNodeState(new Unknown('test//test'));
		});

		it('HTML node', () => {
			testNodeState(new Statement(HTML, '<span>Test</span>'));
		});

		it('TMPL node', () => {
			testNodeState(new Statement(TMPL, '#otherTmpl'));
		});
	});

	describe('Complex token structure', () => {
		const unknowTokenBetween = (startToken, endToken) => {
			const unknownToken = new Unknown();
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

		it('UNKNOWN token inside IF', () => {
			const ifStartToken = new Statement(
				IF,
				'if',
				null,
				new Expression('test.length', null),
				false,
				null,
				findStatementTokenPatternByName(IF)
			);
			const ifEndToken = new Statement(
				IF,
				'if',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(IF, true)
			);

			unknowTokenBetween(ifStartToken, ifEndToken);
		});

		it('UNKNOWN token inside EACH', () => {
			const eachStartToken = new Statement(
				EACH,
				'each',
				null,
				new Expression('test.length', null),
				false,
				null,
				findStatementTokenPatternByName(EACH)
			);
			const eachEndToken = new Statement(
				EACH,
				'each',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(EACH, true)
			);

			unknowTokenBetween(eachStartToken, eachEndToken);
		});

		it('UNKNOWN token inside WRAP', () => {
			const wrapStartToken = new Statement(
				WRAP,
				'wrap',
				null,
				new Expression('#test', null),
				false,
				null,
				findStatementTokenPatternByName(WRAP)
			);
			const wrapEndToken = new Statement(
				WRAP,
				'wrap',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(WRAP, true)
			);

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

		it('IF token inside EACH', () => {
			const ifStartToken = new Statement(
				IF,
				'if',
				null,
				new Expression('test.length', null),
				false,
				null,
				findStatementTokenPatternByName(IF)
			);
			const ifEndToken = new Statement(
				IF,
				'if',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(IF, true)
			);
			const eachStartToken = new Statement(
				EACH,
				'each',
				null,
				new Expression('collection', null),
				false,
				null,
				findStatementTokenPatternByName(EACH)
			);
			const eachEndToken = new Statement(
				EACH,
				'each',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(EACH, true)
			);
			testOuterAndInnerClosingToken(
				eachStartToken,
				eachEndToken,
				ifStartToken,
				ifEndToken
			);
		});

		it('WRAP token inside EACH', () => {
			const wrapStartToken = new Statement(
				WRAP,
				'wrap',
				null,
				new Expression('#test', null),
				false,
				null,
				findStatementTokenPatternByName(WRAP)
			);
			const wrapEndToken = new Statement(
				WRAP,
				'wrap',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(WRAP, true)
			);
			const eachStartToken = new Statement(
				EACH,
				'each',
				null,
				new Expression('collection', null),
				false,
				null,
				findStatementTokenPatternByName(EACH)
			);
			const eachEndToken = new Statement(
				EACH,
				'each',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(EACH, true)
			);
			testOuterAndInnerClosingToken(
				eachStartToken,
				eachEndToken,
				wrapStartToken,
				wrapEndToken
			);
		});

		it('IF token inside IF', () => {
			const ifOuterStartToken = new Statement(
				IF,
				'if',
				null,
				new Expression('test.length', null),
				false,
				null,
				findStatementTokenPatternByName(IF)
			);
			const ifOuterEndToken = new Statement(
				IF,
				'if',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(IF, true)
			);
			const ifInnerStartToken = new Statement(
				IF,
				'if',
				null,
				new Expression('otherArray.length', null),
				false,
				null,
				findStatementTokenPatternByName(IF)
			);
			const ifInnerEndToken = new Statement(
				IF,
				'if',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(IF, true)
			);
			testOuterAndInnerClosingToken(
				ifOuterStartToken,
				ifOuterEndToken,
				ifInnerStartToken,
				ifInnerEndToken
			);
		});

		it('two root IF tokens', () => {
			const ifStartToken = new Statement(
				IF,
				'if',
				null,
				new Expression('test.length', null),
				false,
				null,
				findStatementTokenPatternByName(IF)
			);
			const ifEndToken = new Statement(
				IF,
				'if',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(IF, true)
			);
			const ifOtherStartToken = new Statement(
				IF,
				'if',
				null,
				new Expression('otherArray.length', null),
				false,
				null,
				findStatementTokenPatternByName(IF)
			);
			const ifOtherEndToken = new Statement(
				IF,
				'if',
				null,
				null,
				true,
				null,
				findStatementTokenPatternByName(IF, true)
			);
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

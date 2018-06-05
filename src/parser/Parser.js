const jsep = require('jsep');
const { tokenPatterns, tokenClosePatterns } = require('../tokens/tokens');
const Unknown = require('../model/Unknown');
const Statement = require('../model/Statement');
const Expression = require('../model/Expression');
const ValidationError = require('../model/ValidationError');
const { PARSE_ERROR } = require('../model/error_code');
const Validator = require('../validator/Validator');
const NodeTreeMaker = require('../nodes/NodeTreeMaker');

const {
	tabRegex,
	findAllTokensRegex,
	findAllExpressionsRegex,
	findAllStatementsRegex,
	isCompound,
	isIdentifier,
	isClosingToken,
	extractTokenText,
	isCallExpression,
	getLineNumber
} = require('./parserUtils');

// RegExp remember state so watch it how you use it
const findAllStatements = new RegExp(findAllStatementsRegex);
const findAllExpressions = new RegExp(findAllExpressionsRegex);
const findAllExpressionsGlobal = new RegExp(findAllExpressionsRegex, 'g');

class Parser {
	get tokens() {
		return this._tokens;
	}

	get parseErrors() {
		return this._parseErrors;
	}

	get isValidatingTokens() {
		return this._validateTokens;
	}

	constructor(
		rawText,
		validateTokens = true,
		options = { removeTabs: false }
	) {
		this._rawText = rawText;
		this._tokens = [];
		this._parseErrors = [];
		this._validateTokens = validateTokens;
		this._options = options;
	}

	parse() {
		// TODO this will replace tabs in literal token too!
		let text = this._options.removeTabs
				? this._rawText.replace(tabRegex, '').trim()
				: this._rawText,
			// ekstract all tokens bettween {{}}, ${} and {{= }}
			tokens = text.match(findAllTokensRegex),
			tokenModels = [],
			// position in text that is used like begin index for search
			// this is used for getting start and end position of token inside
			// text
			positionInText = 0,
			parseErrors = [];

		if (tokens != null) {
			for (let curToken of tokens) {
				// check if current token
				let isExpression = curToken.match(findAllExpressionsGlobal),
					tokenModel = null,
					lineNumbersData = getLineNumber(
						text,
						curToken,
						positionInText
					),
					// extract unknown token in front of current token, if there is any
					unknownTokenBefore = this._extractUnknownToken(
						text,
						positionInText,
						lineNumbersData.tokenBegin
					);

				try {
					// if unknown token is present before current token, add it
					// before curren token
					if (unknownTokenBefore != null) {
						tokenModels.push(unknownTokenBefore);
					}

					if (isExpression) {
						tokenModel = this._parseExpressionToken(curToken);
					} else {
						tokenModel = this._parseStatementToken(curToken);
					}
				} catch (e) {
					// if token creation failed, then create new Unknown token
					// position of the token will be set below
					tokenModel = this._createUnknownToken(curToken);

					// handle all parse errors here
					parseErrors.push(
						new ValidationError(
							tokenModel.id,
							PARSE_ERROR.code,
							e.message,
							lineNumbersData.lineNumbers
						)
					);
				}

				// even is token is not valid position behind it
				positionInText =
					lineNumbersData.tokenEnd !== -1
						? lineNumbersData.tokenEnd
						: positionInText;
				tokenModel.lineNumber = lineNumbersData.lineNumbers;
				tokenModels.push(tokenModel);
			}
		}

		// extract all remaining unknown tokens at the end
		if (positionInText < text.length) {
			tokenModels.push(
				this._extractUnknownToken(text, positionInText, text.length)
			);
		}

		this._tokens = tokenModels;

		// if validation flag is true
		if (this._validateTokens === true) {
			// create new instance of validator
			let validator = new Validator(this._tokens);
			// validate all found tokens by rules and merge them with existing errors found by parser
			parseErrors = parseErrors.concat(validator.validate());
		}

		this._parseErrors = parseErrors;
	}

	getNodeTree() {
		if (this._parseErrors.length > 0) {
			throw new Error(
				'Can not create node tree if there are validation errors'
			);
		}
		const nodeTreeMaker = new NodeTreeMaker(this._tokens);

		return nodeTreeMaker.createTree();
	}

	_parseExpressionToken(token) {
		let tokenMatches = token.match(findAllExpressions),
			n = tokenMatches.length,
			tokenValue = null;

		while ((tokenValue = tokenMatches.pop()) == null && --n >= 0);

		if (tokenValue.trim().length === 0) {
			throw new Error(
				PARSE_ERROR.message('Expression value can not be empty')
			);
		}

		// parse token
		let expressionTree = jsep(tokenValue);

		return this._createExpression(expressionTree, token);
	}

	_parseStatementToken(token) {
		// extract content between parentheses
		let tokenValue = token.match(findAllStatements).pop(),
			// parse token
			tokenTree = jsep(tokenValue),
			statementAndExpression = this.extractStatementAndExpression(
				tokenTree
			),
			closingToken = isClosingToken(tokenTree);

		if (statementAndExpression != null) {
			let { statementTree, expressionTree } = statementAndExpression,
				// check if pattern for token exists
				statementTokenPattern = this.findStatementTokenPattern(
					statementTree,
					closingToken
				);
			// if pattern exist then it is valid token
			// if not then this is not supported token or
			// closing rule is violited
			if (statementTokenPattern != null) {
				// create expression model only if expression tree exists
				let expressionModel = this._createExpression(
						expressionTree,
						token
					),
					params = this._getParams(statementTree, token);

				return new Statement(
					statementTokenPattern.name,
					extractTokenText(statementTree),
					statementTree,
					expressionModel,
					closingToken,
					params,
					statementTokenPattern
				);
			} else {
				throw new Error(
					PARSE_ERROR.message(
						`Unable to extract pattern for statement "${extractTokenText(
							statementTree
						)}"`
					)
				);
			}
		} else {
			throw new Error(
				PARSE_ERROR.message(
					`Unable to extract statement and expression from token "${tokenValue}"`
				)
			);
		}
	}

	_createExpression(expressionTree, tokenText) {
		if (expressionTree != null) {
			// get expression value
			let value = extractTokenText(expressionTree);
			return new Expression(value, expressionTree);
		}

		return null;
	}

	_extractUnknownToken(text, fromPosition, toPosition) {
		let unknownValue = text.substring(fromPosition, toPosition);

		if (unknownValue.length > 0) {
			return this._createUnknownToken(unknownValue);
		} else {
			return null;
		}
	}

	_createUnknownToken(value) {
		return new Unknown(value);
	}

	_getParams(tokenTree, tokenText) {
		let params = [];

		// only call expressions have parameters
		if (isCallExpression(tokenTree)) {
			// all parameters model

			for (let curParam of tokenTree.arguments) {
				let curParamValue = extractTokenText(curParam);
				params.push(new Expression(curParamValue, curParam));
			}
		}

		return params;
	}

	extractStatementAndExpression(tokenTree) {
		if (isCompound(tokenTree)) {
			let bodyTokens = tokenTree.body;

			return {
				statementTree: bodyTokens[0],
				expressionTree: bodyTokens[1]
			};
		} else if (isIdentifier(tokenTree)) {
			return {
				statementTree: tokenTree,
				expressionTree: null
			};
		} else if (isCallExpression(tokenTree)) {
			if (tokenTree.arguments.length === 1) {
				return {
					statementTree: tokenTree.callee,
					expressionTree: tokenTree.arguments[0]
				};
			} else {
				return {
					statementTree: tokenTree,
					expressionTree: null
				};
			}
		} else if (isClosingToken(tokenTree)) {
			// if this is closing token
			return {
				statementTree: tokenTree.right,
				expressionTree: null
			};
		}

		return null;
	}

	findStatementTokenPattern(statementTree, isClosingToken) {
		let patternTypes = null,
			statementName = null;

		if (isIdentifier(statementTree)) {
			patternTypes = isClosingToken
				? tokenClosePatterns.identifier
				: tokenPatterns.identifier;
			statementName = statementTree.name;
		} else if (isCallExpression(statementTree)) {
			patternTypes = isClosingToken
				? tokenClosePatterns.callExpression
				: tokenPatterns.callExpression;
			statementName = statementTree.callee.name;
		} else {
			return null;
		}

		return patternTypes.find(
			curTokenPattern =>
				// if pattern name and statment token name are same
				curTokenPattern.name === statementName
		);
	}
}
module.exports = Parser;

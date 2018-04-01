const jsep = require('jsep');
const { findStatementTokenPattern } = require('../tokens/tokens');
const Unknown = require('../model/Unknown');
const Statement = require('../model/Statement');
const Expression = require('../model/Expression');
const Parameter = require('../model/Parameter');
const ValidationError = require('../model/ValidationError');
const { PARSE_ERROR } = require('../validator/error_code');
const Validator = require('../validator/Validator');
const NodeTreeMaker = require('../nodes/NodeTreeMaker');

const {
	newLinesRegex,
	findAllTokensRegex,
	findAllExpressionsRegex,
	findAllStatementsRegex,
	isCompound,
	isIdentifier,
	isClosingToken,
	extractTokenText,
	isCallExpression
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

	constructor(rawText, validateTokens = true) {
		this._rawText = rawText;
		this._tokens = [];
		this._parseErrors = [];
		this._validateTokens = validateTokens;
	}

	parse() {
		// strip all new lines in text
		let text = this._rawText.replace(newLinesRegex, '').trim(),
			// ekstract all tokens bettween {{}} and ${}
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
					tokenPosition = this._getTokenPositionInText(
						curToken,
						text,
						positionInText
					);

				try {
					if (isExpression) {
						tokenModel = this._parseExpressionToken(
							curToken,
							tokenPosition.begin
						);
					} else {
						tokenModel = this._parseStatementToken(
							curToken,
							tokenPosition.begin
						);
					}
				} catch (e) {
					// if token creation failed, then create new Unknown token
					// position of the token will be set below
					tokenModel = this._createUnknownToken(curToken);

					// handle all parse errors here
					parseErrors.push(
						new ValidationError(tokenModel, PARSE_ERROR.code, e)
					);
				}

				// even is token is not valid position behind it
				positionInText = tokenPosition.end;

				// set position in text on token, we do
				// not care about type of the token
				tokenModel.position = tokenPosition;
				tokenModels.push(tokenModel);
			}
		}

		// extract all remaining unknown tokens
		let unknownTokenModels = this._findUnknownTokens(text, tokenModels);

		this._tokens = tokenModels
			// merge known tokens with unknown tokens
			.concat(unknownTokenModels)
			// and then sort tokens by starting position because order of tokens in array
			// is very important to be corect like original input text
			.sort(
				(tokenX, tokenY) =>
					tokenX.position.begin - tokenY.position.begin
			);

		// if validation flag is true
		if (this._validateTokens === true) {
			// create new instance of validator
			let validator = new Validator(this._tokens);
			// validate all found tokens by rules and merge them with existing errors found by parser
			parseErrors = parseErrors.concat(validator.validate());
		}

		this._parseErrors = parseErrors;
	}

	getNoteTree() {
		if (this._parseErrors.length > 0) {
			throw new Error(
				'Can not create node tree if there are validation errors'
			);
		}
		const nodeTreeMaker = new NodeTreeMaker(this._tokens);

		return nodeTreeMaker.createTree();
	}

	_parseExpressionToken(token, tokenPosition) {
		let tokenValue = token.match(findAllExpressions).pop();

		if (tokenValue.trim().length === 0) {
			throw new Error(
				PARSE_ERROR.message('Expression value can not be empty')
			);
		}

		// parse token
		let expressionTree = jsep(tokenValue);

		return this._createExpression(expressionTree, token, tokenPosition);
	}

	_parseStatementToken(token, tokenPosition) {
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
				statementTokenPattern = findStatementTokenPattern(
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
						token,
						tokenPosition
					),
					params = this._getParams(
						statementTree,
						token,
						tokenPosition
					);

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

	_createExpression(expressionTree, tokenText, tokenPosition) {
		if (expressionTree != null) {
			// get expression value
			let value = extractTokenText(expressionTree);
			return new Expression(
				value,
				expressionTree,
				this._getTokenPositionInText(value, tokenText, tokenPosition)
			);
		}

		return null;
	}

	_findUnknownTokens(text, knownTokenModels) {
		// start from text begining
		let beginIndex = 0,
			unknownTokenModels = [];
		// we need to find all parts of text between known tokens
		// all those parts that are not found by token regex are considered
		// unknown tokens
		for (let curToken of knownTokenModels) {
			// extract part of text between begin of text and token
			// or between two known tokens
			let unknownValue = text.substring(
				beginIndex,
				curToken.position.begin
			);
			if (unknownValue.length > 0) {
				unknownTokenModels.push(
					this._createUnknownToken(unknownValue, {
						begin: beginIndex,
						end: curToken.position.begin
					})
				);
			}
			beginIndex = curToken.position.end;
		}

		// collect all characters after know token
		// and create one more unknown token at the end
		if (beginIndex < text.length) {
			unknownTokenModels.push(
				this._createUnknownToken(
					text.substring(beginIndex, text.length),
					{
						begin: beginIndex,
						end: text.length
					}
				)
			);
		}

		return unknownTokenModels;
	}

	_createUnknownToken(value, position) {
		return new Unknown(value, position);
	}

	_getTokenPositionInText(tokenValue, text, fromPosition, offset = 0) {
		// search begin of the token inside text
		let tokenPositionBegin = text.indexOf(tokenValue, fromPosition),
			// move new postion behind the current token
			// to prevent double search in prevous text
			tokenPositionEnd = tokenPositionBegin + tokenValue.length;

		return {
			begin: offset + tokenPositionBegin,
			end: offset + tokenPositionEnd
		};
	}

	_getParams(tokenTree, tokenText, tokenPosition) {
		// only call expressions have parameters
		if (isCallExpression(tokenTree)) {
			// all parameters model
			let params = [],
				// pointer of position inside tokenText
				postionInTokenText = 0;

			for (let curParam of tokenTree.arguments) {
				let curParamValue = extractTokenText(curParam),
					// extract position of the current parameter
					paramPosition = this._getTokenPositionInText(
						curParamValue,
						tokenText,
						postionInTokenText,
						tokenPosition
					);
				params.push(
					new Parameter(curParamValue, curParam, paramPosition)
				);
			}

			return params;
		}

		return null;
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
		} else if (isClosingToken(tokenTree)) {
			// if this is closing token
			return {
				statementTree: tokenTree.right,
				expressionTree: null
			};
		}

		return null;
	}
}
module.exports = Parser;

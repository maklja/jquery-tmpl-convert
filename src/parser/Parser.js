const { UNKNOWN, VAR, tokens } = require('../tokens/tokens');
const Token = require('../model/Token');
const {
	newLinesRegex,
	findAllTokensRegex,
	tokenWithoutStatement,
	tokenFunctionWithParameters,
	getBracketLengths
} = require('./token_parsers/tokenParser');

module.exports = class Parser {
	constructor(text, tokensParam = tokens) {
		this._text = text;
		this._tokenPatterns = tokensParam.filter(curToken => {
			return curToken.name !== UNKNOWN.name;
		});

		this._tokens = [];
	}

	get tokens() {
		return this._tokens;
	}

	parse() {
		// strip all new lines in text
		let text = this._text.replace(newLinesRegex, '').trim(),
			// ekstract all tokens bettween {{}} and ${}
			tokens = text.match(findAllTokensRegex),
			tokenModels = [],
			// position in text that is used like begin index for search
			// this is used for getting start and end position of token inside
			// text
			positionInText = 0;

		if (tokens != null) {
			for (let curToken of tokens) {
				// find pattern for token
				let patternModel = this._findTokenPatternMatch(curToken),
					// search begin of the token inside text
					tokenPositionBegin = text.indexOf(curToken, positionInText);

				// move new postion behind the current token
				// to prevent double search in prevous text
				positionInText = tokenPositionBegin + curToken.length;
				// pattern does not exitst this is probably invalid token
				if (patternModel == null) {
					tokenModels.push(
						this._createNewToken(
							UNKNOWN.name,
							tokenPositionBegin,
							positionInText,
							curToken
						)
					);
				} else {
					tokenModels.push(
						this._createNewToken(
							patternModel.name,
							tokenPositionBegin,
							positionInText,
							// extract statement
							this._getTokenStatement(curToken, patternModel),
							// extract token parameters if any exists
							this._getTokenParams(curToken, patternModel.token)
						)
					);
				}
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
				(tokenX, tokenY) => tokenX.startPosition - tokenY.startPosition
			);
	}

	_findUnknownTokens(text, knownTokenModels) {
		let beginIndex = 0,
			unknownTokenModels = [];
		// we need to find all parts of text between known tokens
		// all those parts that are not found by token regex are considered
		// unknown tokens
		for (let curToken of knownTokenModels) {
			// extract part of text between begin of text and token
			// or between two known tokens
			let statement = text.substring(beginIndex, curToken.startPosition);
			if (statement.length > 0) {
				unknownTokenModels.push(
					this._createNewToken(
						UNKNOWN.name,
						beginIndex,
						curToken.startPosition,
						statement
					)
				);
			}
			beginIndex = curToken.endPosition;
		}

		// collect all characters after know token
		// and create one more unknown token at the end
		if (beginIndex < text.length) {
			unknownTokenModels.push(
				this._createNewToken(
					UNKNOWN.name,
					beginIndex,
					text.length,
					text.substring(beginIndex, text.length)
				)
			);
		}

		return unknownTokenModels;
	}

	_getTokenStatement(token, patternModel) {
		if (patternModel.name === VAR.name) {
			return token
				.match(patternModel.pattern)
				.pop()
				.trim();
		} else {
			const { startLength, endLength } = getBracketLengths(
				token,
				patternModel.pattern
			);
			let statementBegin =
					token.match(tokenWithoutStatement(patternModel.token)).pop()
						.length + startLength,
				statementEnd = token.length - endLength;

			return token.substring(statementBegin, statementEnd).trim();
		}
	}

	_getTokenParams(token, tokenName) {
		if (tokenName != null) {
			let tokenParameters = tokenFunctionWithParameters(tokenName).exec(
				token
			);

			if (tokenParameters != null) {
				return tokenParameters
					.pop()
					.split(',')
					.map(param => param.trim());
			}
		}
		return null;
	}

	_findTokenPatternMatch(token) {
		// try to find pattern for token
		let tokenPattern = this._tokenPatterns.find(curTokenPattern => {
			return token.match(curTokenPattern.pattern) != null;
		});

		return tokenPattern;
	}

	_createNewToken(
		name,
		positionStart,
		positionEnd,
		statement,
		params = null
	) {
		return new Token(name, positionStart, positionEnd, statement, params);
	}
};

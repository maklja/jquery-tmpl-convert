const { UNKNOWN, tokens } = require('../tokens/tokens');
const Token = require('../model/Token');
const { tokenStart, tokenEnd } = require('./token_parsers/tokenParser');

module.exports = class Parser {
	constructor(text, tokensParam = tokens) {
		this._text = text;
		this._position = 0;
		this._tokenPatterns = tokensParam.filter(curToken => {
			return curToken.name !== UNKNOWN.name;
		});

		this._tokens = [];
		this._currentTextToken = null;
	}

	get position() {
		return this._position;
	}

	get tokens() {
		return this._tokens;
	}

	hasNextCharacter() {
		return this._position < this._text.length;
	}

	nextCharacter() {
		return this._text[this._position++];
	}

	seekPosition(position) {
		this._position = position;
	}

	parse() {
		while (this.hasNextCharacter()) {
			let tokenPattern = this._findTokenPatternMatch(),
				token;

			if (tokenPattern != null) {
				token = this._createToken(tokenPattern);
			} else {
				token = this._createUnknownToken();
			}

			this._tokens.push(token);
		}
	}

	_createToken(tokenPattern) {
		let statement = '',
			startPosition = this.position,
			statementPositionStart = this.position + tokenPattern.start.length;

		this.seekPosition(statementPositionStart);
		let tokenEndFound = tokenEnd(
			this._text,
			this.position,
			tokenPattern.end
		);
		while (tokenEndFound === false && this.hasNextCharacter()) {
			statement += this.nextCharacter();
			tokenEndFound = tokenEnd(
				this._text,
				this.position,
				tokenPattern.end
			);
		}

		// if we did not found closing tag then this is unknown token
		if (tokenEndFound === false) {
			return new Token(
				UNKNOWN.name,
				startPosition,
				this.position,
				this._text.substring(startPosition, this._text.length)
			);
		}

		// we found closing tag, so we need to set position behind it
		this.seekPosition(this.position + tokenPattern.end.length);
		return new Token(
			tokenPattern.name,
			startPosition,
			this.position,
			statement.trim()
		);
	}

	_createUnknownToken() {
		let startPosition = this.position,
			unknownTokenStatment = '';

		do {
			unknownTokenStatment += this.nextCharacter();
		} while (
			this.hasNextCharacter() &&
			this._findTokenPatternMatch() == null
		);

		return new Token(
			UNKNOWN.name,
			startPosition,
			this.position - 1,
			unknownTokenStatment
		);
	}

	_findTokenPatternMatch() {
		let tokenPattern = this._tokenPatterns.find(curTokenPattern => {
			return tokenStart(this._text, this.position, curTokenPattern.start);
		});

		return tokenPattern;
	}
};

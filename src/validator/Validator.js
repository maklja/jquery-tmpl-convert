const ValidationError = require('../model/ValidationError');

const {
	EXPRESSION_MISSING,
	UNEXPECTED_EXPRESSION,
	MISSING_CLOSING_TOKEN,
	MISSING_STARTING_TOKEN,
	MISSING_SIBLING_TOKEN
} = require('../model/error_code');

module.exports = class Validator {
	constructor(tokens) {
		this._tokens = tokens;
		this._validationErrors = [];
		this._closeTokenMissing = [];
	}

	validate() {
		for (let curToken of this._tokens) {
			if (curToken == null) {
				throw new Error('Token parameter can not be null');
			}

			let tokenPatternRule = curToken.pattern;
			if (tokenPatternRule != null) {
				let errors = this._validateStatementToken(
					curToken,
					tokenPatternRule
				);

				if (errors.length > 0) {
					this._validationErrors = this._validationErrors.concat(
						errors
					);
				}
			}
		}

		if (this._closeTokenMissing.length > 0) {
			let missingClosingToken = this._closeTokenMissing.pop();
			this._validationErrors.push(
				new ValidationError(
					missingClosingToken.id,
					MISSING_CLOSING_TOKEN.code,
					MISSING_CLOSING_TOKEN.message(missingClosingToken),
					missingClosingToken.lineNumber
				)
			);
		}

		return this._validationErrors;
	}

	_validateStatementToken(token, tokenPatternRule) {
		let validationErrors = [];

		this._checkExpression(token, tokenPatternRule, validationErrors);
		this._checkMissingClosingToken(token, tokenPatternRule);
		this._checkSiblingTokens(token, tokenPatternRule, validationErrors);
		this._checkClosingToken(token, tokenPatternRule, validationErrors);

		return validationErrors;
	}

	_checkExpression(token, tokenPatternRule, validationErrors) {
		if (
			tokenPatternRule.hasExpression &&
			tokenPatternRule.expressionMandatory &&
			!token.expression
		) {
			validationErrors.push(
				new ValidationError(
					token.id,
					EXPRESSION_MISSING.code,
					EXPRESSION_MISSING.message(token),
					token.lineNumber
				)
			);
		} else if (
			tokenPatternRule.hasExpression === false &&
			token.expression
		) {
			validationErrors.push(
				new ValidationError(
					token.id,
					UNEXPECTED_EXPRESSION.code,
					UNEXPECTED_EXPRESSION.message(token),
					token.lineNumber
				)
			);
		}
	}

	_checkMissingClosingToken(token, tokenPatternRule) {
		// if token has closing tag
		if (tokenPatternRule.hasClosing) {
			this._closeTokenMissing.push(token);
		}
	}

	_checkSiblingTokens(token, tokenPatternRule, validationErrors) {
		if (tokenPatternRule.afterTokens) {
			let lastToken = this.peekLastTokenWithoutClosing();

			if (
				lastToken == null ||
				tokenPatternRule.afterTokens.find(
					curToken => curToken.name === lastToken.name
				) === null
			) {
				validationErrors.push(
					new ValidationError(
						token.id,
						MISSING_SIBLING_TOKEN.code,
						MISSING_SIBLING_TOKEN.message(
							token,
							tokenPatternRule.afterTokens
								.map(token => token.name)
								.join(', ')
						),
						token.lineNumber
					)
				);
			}
		}
	}

	_checkClosingToken(token, tokenPatternRule, validationErrors) {
		// if token is closing token
		if (token.isClosing === false) {
			return;
		}

		if (this._closeTokenMissing.length === 0) {
			validationErrors.push(
				new ValidationError(
					token.id,
					MISSING_STARTING_TOKEN.code,
					MISSING_STARTING_TOKEN.message(token),
					token.lineNumber
				)
			);
			return;
		}

		let lastToken = this.peekLastTokenWithoutClosing();

		if (lastToken.name === token.name) {
			this._closeTokenMissing.pop();
		} else {
			validationErrors.push(
				new ValidationError(
					token.id,
					MISSING_STARTING_TOKEN.code,
					MISSING_STARTING_TOKEN.message(token),
					token.lineNumber
				)
			);
		}
	}

	peekLastTokenWithoutClosing() {
		return this._closeTokenMissing[this._closeTokenMissing.length - 1];
	}
};

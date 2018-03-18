const ValidationError = require('../model/ValidationError');
const { findRule } = require('../utils/rules.js');
const {
	STATMENT_MISSING,
	UNEXPECTED_STATMENT,
	MISSING_CLOSING_TOKEN,
	MISSING_STARTING_TOKEN,
	MISSING_SIBLING_TOKEN
} = require('./error_code');

module.exports = class Validator {
	constructor(tokens) {
		this._validationErrors = [];
		this._closeTokenMissing = [];
		this._tokens = tokens;
	}

	validate() {
		this._validationErrors = [];
		this._closeTokenMissing = [];

		for (let curToken of this._tokens) {
			let rule = findRule(curToken);
			if (rule != null) {
				let errors = this._validateToken(curToken, rule);
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
					missingClosingToken,
					MISSING_CLOSING_TOKEN.message(missingClosingToken),
					MISSING_CLOSING_TOKEN.code
				)
			);
		}

		return this._validationErrors;
	}

	_validateToken(token, rule) {
		let validationErrors = [];
		if (rule.hasStatement && !token.statement) {
			validationErrors.push(
				new ValidationError(
					token,
					STATMENT_MISSING.message(token),
					STATMENT_MISSING.code
				)
			);
		} else if (rule.hasStatement === false && token.statement) {
			validationErrors.push(
				new ValidationError(
					token,
					UNEXPECTED_STATMENT.message(token),
					UNEXPECTED_STATMENT.code
				)
			);
		}

		this._checkMissingClosingToken(token, rule);
		this._checkSiblingTokens(token, rule, validationErrors);
		this._checkClosingToken(token, rule, validationErrors);

		return validationErrors;
	}

	_checkMissingClosingToken(token, rule) {
		// if token has closing tag
		if (rule.closeToken != null) {
			this._closeTokenMissing.push(token);
		}
	}

	_checkSiblingTokens(token, rule, validationErrors) {
		if (rule.afterTokens) {
			let lastToken = this.peekLastTokenWithoutClosing();

			if (
				lastToken == null ||
				rule.afterTokens.find(
					curToken => curToken.name === lastToken.name
				) === null
			) {
				validationErrors.push(
					new ValidationError(
						token,
						MISSING_SIBLING_TOKEN.message(token),
						MISSING_SIBLING_TOKEN.code
					)
				);
			}
		}
	}

	_checkClosingToken(token, rule, validationErrors) {
		// if token is closing token
		if (!rule.isCloseToken) {
			return;
		}

		if (this._closeTokenMissing.length === 0) {
			validationErrors.push(
				new ValidationError(
					token,
					MISSING_STARTING_TOKEN.message(token),
					MISSING_STARTING_TOKEN.code
				)
			);
			return;
		}

		let lastToken = this.peekLastTokenWithoutClosing(),
			lastTokenRule = findRule(lastToken);

		if (lastTokenRule.closeToken.name === token.name) {
			this._closeTokenMissing.pop();
		} else {
			validationErrors.push(
				new ValidationError(
					token,
					MISSING_STARTING_TOKEN.message(token),
					MISSING_STARTING_TOKEN.code
				)
			);
		}
	}

	peekLastTokenWithoutClosing() {
		return this._closeTokenMissing[this._closeTokenMissing.length - 1];
	}
};

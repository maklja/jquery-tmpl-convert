const ErrorTypes = require('./ErrorTypes.js');

class ValidationError extends Error {
	get code() {
		return this._code;
	}

	get tokenId() {
		return this._tokenId;
	}

	get lineNumber() {
		return this._lineNumber;
	}

	get type() {
		return this._type;
	}

	constructor(
		tokenId,
		code,
		message,
		lineNumber = [],
		type = ErrorTypes.Error
	) {
		super(message);

		// Saving class name in the property of our custom error as a shortcut.
		this.name = this.constructor.name;

		// Capturing stack trace, excluding constructor call from it.
		Error.captureStackTrace(this, this.constructor);

		this._code = code;
		this._tokenId = tokenId;
		this._lineNumber = lineNumber;
		this._type = type;
	}

	toJSON() {
		let message = this.message,
			{ tokenId, code, lineNumber, type } = this;

		return { tokenId, message, code, lineNumber, type };
	}
}

module.exports = ValidationError;

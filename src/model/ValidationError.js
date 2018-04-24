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

	constructor(tokenId, code, message, lineNumber = []) {
		super(message);

		// Saving class name in the property of our custom error as a shortcut.
		this.name = this.constructor.name;

		// Capturing stack trace, excluding constructor call from it.
		Error.captureStackTrace(this, this.constructor);

		this._code = code;
		this._tokenId = tokenId;
		this._lineNumber = lineNumber;
	}

	toJSON() {
		let message = this.message,
			{ tokenId, code, lineNumber } = this;

		return { tokenId, message, code, lineNumber };
	}
}

module.exports = ValidationError;

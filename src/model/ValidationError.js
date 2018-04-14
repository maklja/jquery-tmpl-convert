class ValidationError extends Error {
	get errorCode() {
		return this._errorCode;
	}

	get token() {
		return this._token;
	}

	constructor(token, errorCode, message) {
		super(message);

		// Saving class name in the property of our custom error as a shortcut.
		this.name = this.constructor.name;

		// Capturing stack trace, excluding constructor call from it.
		Error.captureStackTrace(this, this.constructor);

		this._errorCode = errorCode;
		this._token = token;
	}

	toJSON() {
		let token = this.token.toJSON(),
			message = this.message,
			{ errorCode } = this;

		return { token, message, errorCode };
	}
}

module.exports = ValidationError;

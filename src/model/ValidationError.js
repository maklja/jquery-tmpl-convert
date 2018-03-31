module.exports = class ValidationError {
	get message() {
		return this._error.message;
	}

	get errorCode() {
		return this._errorCode;
	}

	get token() {
		return this._token;
	}

	get error() {
		return this._error;
	}

	constructor(token, errorCode, error) {
		this._errorCode = errorCode;
		this._token = token;
		this._error = error;
	}
};

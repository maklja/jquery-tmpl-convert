module.exports = class ValidationError {
	get message() {
		return this._message;
	}

	get errorCode() {
		return this._errorCode;
	}

	get token() {
		return this._token;
	}

	constructor(token, message, errorCode) {
		this._message = message;
		this._errorCode = errorCode;
		this._token = token;
	}
};

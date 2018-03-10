class Token {
	get startPosition() {
		return this._startPosition;
	}

	set startPosition(position) {
		this._startPosition = position;
	}

	get endPosition() {
		return this._endPosition;
	}

	set endPosition(position) {
		this._endPosition = position;
	}

	get type() {
		return this._type;
	}

	set type(type) {
		this._type = type;
	}

	get statement() {
		return this._statement;
	}

	set statement(statement) {
		this._statement = statement;
	}

	constructor(type, startPosition, endPosition, statement) {
		this._type = type;
		this._startPosition = startPosition;
		this._endPosition = endPosition;
		this._statement = statement;
	}
}

module.exports = Token;

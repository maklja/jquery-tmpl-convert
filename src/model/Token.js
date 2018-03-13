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

	get name() {
		return this._name;
	}

	set name(name) {
		this._name = name;
	}

	get statement() {
		return this._statement;
	}

	set statement(statement) {
		this._statement = statement;
	}

	constructor(name, startPosition, endPosition, statement) {
		this._name = name;
		this._startPosition = startPosition;
		this._endPosition = endPosition;
		this._statement = statement;
	}
}

module.exports = Token;

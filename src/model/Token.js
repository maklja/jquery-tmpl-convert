class Token {
	get name() {
		return this._name;
	}

	get value() {
		return this._value;
	}

	get tree() {
		return this._tree;
	}

	get position() {
		return this._position;
	}

	set position(position) {
		this._position = position;
	}

	constructor(name, value, tree, position) {
		this._name = name;
		this._value = value;
		this._tree = tree;
		this._position = position;
	}
}

module.exports = Token;

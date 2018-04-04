module.exports = class TemplateModel {
	get id() {
		return this._id;
	}

	get type() {
		return this._type;
	}

	get path() {
		return this._path;
	}

	get value() {
		return this._value;
	}

	get tokenNodes() {
		return this._tokenNodes;
	}

	set tokenNodes(tokenNodes) {
		this._tokenNodes = tokenNodes;
	}

	get errors() {
		return this._errors;
	}

	set errors(errors) {
		this._errors = errors;
	}

	constructor(id, type, path, value) {
		this._id = id;
		this._type = type;
		this._path = path;
		this._tokenNodes = null;
		this._value = value;
		this._errors = [];
	}
};

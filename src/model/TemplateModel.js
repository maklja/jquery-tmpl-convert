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

	set value(val) {
		this._value = val;
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

	get html() {
		return this._html;
	}

	set html(html) {
		this._html = html;
	}

	constructor(id, type, path, value, html) {
		this._id = id;
		this._type = type;
		this._path = path;
		this._tokenNodes = [];
		this._value = value;
		this._html = html;
		this._errors = [];
	}

	toJSON() {
		let { id, type, path, value, html } = this,
			tokenNodes = this.tokenNodes.map(curNode => curNode.toJSON()),
			errors = this.errors.map(curErr => curErr.toJSON());

		return { id, type, path, value, tokenNodes, errors, html };
	}
};

class Converter {
	get convertTemplates() {
		return this._convertTemplates;
	}

	get id() {
		throw new Error(
			'Override this method with specific converter implementation.'
		);
	}

	get name() {
		throw new Error(
			'Override this method with specific converter implementation.'
		);
	}

	constructor(cfg) {
		this._convertTemplates = [];
	}

	convert(templates) {
		throw new Error(
			'Override this method with specific converter implementation.'
		);
	}
}

module.exports = Converter;

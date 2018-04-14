const TemplateParser = require('../parser/TemplateParser');

class ConvertService {
	constructor() {
		this.templates = null;
	}

	loadTemplates(paths) {
		let parserTemplate = new TemplateParser(paths);

		return new Promise((fulfill, reject) => {
			parserTemplate
				.loadTemplates()
				.then(() => {
					this.templates = parserTemplate.templates.map(curTmpl =>
						curTmpl.toJSON()
					);

					fulfill(this.templates);
				})
				.catch(e => reject(e));
		});
	}
}

module.exports = new ConvertService();

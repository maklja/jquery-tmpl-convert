const glob = require('glob');
const TemplateParser = require('../parser/TemplateParser');
const HandlebarsConverter = require('../converter/handlerbars/HandlebarsConverter');

class ConvertService {
	constructor() {
		this.templates = null;
		this.paths = [
			'/home/maklja/test/node_test/test/converter/**/*.html',
			'/home/maklja/www/*.htm'
		];
		this.resolvedPaths = [];
	}

	initialize() {
		return this._loadPaths(this.paths).then(paths => {
			this.resolvedPaths = paths.reduce(
				(allPaths, curPaths) => allPaths.concat(curPaths),
				[]
			);
			this.parserTemplate = new TemplateParser(this.resolvedPaths);
		});
	}

	_loadTemplates() {
		return new Promise((fulfill, reject) => {
			this.parserTemplate
				.parse()
				.then(() => fulfill(this.parserTemplate.templates))
				.catch(e => reject(e));
		});
	}

	convertTemplates() {
		return new Promise((fulfill, reject) => {
			this._loadTemplates()
				.then(tmpls => {
					let handlebarsConverter = new HandlebarsConverter(),
						templatesPair = {
							originalTemplates: tmpls,
							convertedTemplates: null
						};
					handlebarsConverter.convert(tmpls);

					templatesPair.convertedTemplates =
						handlebarsConverter.convertTemplates;

					fulfill(templatesPair);
				})
				.catch(reject);
		});
	}

	_loadPaths(paths) {
		let promises = [];
		for (let curPath of paths) {
			promises.push(this._loadPath(curPath));
		}

		return Promise.all(promises);
	}

	_loadPath(path) {
		return new Promise((fulfill, reject) => {
			// use glob to support regex in path
			glob(path, (err, filePaths) => {
				if (err) {
					if (err) {
						reject(err);
					}
				}

				fulfill(filePaths);
			});
		});
	}
}

module.exports = new ConvertService();

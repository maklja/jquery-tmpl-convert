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
		});
	}

	convertTemplates(pathIndex, limits) {
		return new Promise((fulfill, reject) => {
			this._loadTemplates(pathIndex, limits)
				.then(tmplsData => {
					// prepair converter
					let handlebarsConverter = new HandlebarsConverter();
					handlebarsConverter.convert(tmplsData.tmpls);

					// send response to the client
					fulfill({
						originalTemplates: tmplsData.tmpls,
						convertedTemplates:
							handlebarsConverter.convertTemplates,
						pathIndex: tmplsData.paths.length,
						countPaths: this.resolvedPaths.length
					});
				})
				.catch(reject);
		});
	}

	_loadTemplates(pathIndex, limits) {
		const toPathIndex = pathIndex + limits;
		const paths = this.resolvedPaths.slice(pathIndex, toPathIndex);

		return new Promise((fulfill, reject) => {
			const parserTemplate = new TemplateParser(paths);
			parserTemplate
				.parse()
				.then(() => fulfill({ tmpls: parserTemplate.templates, paths }))
				.catch(e => reject(e));
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

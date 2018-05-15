const fs = require('fs');
const glob = require('glob');
const TemplateParser = require('../parser/TemplateParser');
const HandlebarsConverter = require('../converter/handlerbars/HandlebarsConverter');

class ConvertService {
	constructor(config) {
		this._paths = config.paths;
		this._outputDir = config.outputDir;
		this._clearOutputDir = config.clearOutputDir;
		this._originalTmpl = [];
		this._convertedTmpl = [];
	}

	initialize() {
		return this._loadPaths(this._paths)
			.then(paths => this._loadTemplates(paths))
			.then(tmpls => (this._originalTmpl = tmpls));
	}

	convertTemplates(index, limits) {
		return new Promise((fulfill, reject) => {
			// prepair converter
			let hbsConverter = new HandlebarsConverter({
					outputDir: this._outputDir,
					clearOutputDir: this._clearOutputDir
				}),
				toIndex = index + limits,
				originalTmplData = this._originalTmpl.slice(index, toIndex);

			if (this._convertedTmpl.length >= toIndex) {
				// send response to the client
				fulfill({
					originalTemplates: originalTmplData,
					convertedTemplates: this._convertedTmpl.slice(
						index,
						toIndex
					),
					index:
						toIndex < this._originalTmpl.length
							? toIndex
							: this._originalTmpl.length,
					maxTmpls: this._originalTmpl.length
				});
			} else {
				hbsConverter
					.convert(originalTmplData)
					.then(() => {
						const convTmpls = hbsConverter.convertTemplates;
						this._convertedTmpl = this._convertedTmpl.concat(
							convTmpls
						);

						// send response to the client
						fulfill({
							originalTemplates: originalTmplData,
							convertedTemplates: convTmpls,
							index:
								toIndex < this._originalTmpl.length
									? toIndex
									: this._originalTmpl.length,
							maxTmpls: this._originalTmpl.length
						});
					})
					.catch(reject);
			}
		});
	}

	updateTemplate(tmplId, tmplHTML) {
		const updatedTmplData = TemplateParser.extractTemplateHTML(tmplHTML);

		if (updatedTmplData.length === 0) {
			return Promise.reject(new Error('Script tag is not found.'));
		}

		if (updatedTmplData.length > 1) {
			return Promise.reject(new Error('Multiple script tags found.'));
		}

		const tmplModel = this._convertedTmpl.find(
			curTmpl => curTmpl.id === tmplId
		);

		if (tmplModel == null) {
			return Promise.reject(
				new Error(`Template with id ${tmplId} is not found.`)
			);
		}
		const tmplDelta = updatedTmplData[0];
		return new Promise((fulfill, reject) => {
			fs.writeFile(tmplModel.path, tmplDelta.outerHTML, err => {
				if (err) {
					reject(err);
					return;
				}

				tmplModel.value = tmplDelta.innerHTML;
				tmplModel.html = tmplDelta.outerHTML;

				fulfill(tmplModel.toJSON());
			});
		});
	}

	_loadTemplates(paths) {
		return new Promise((fulfill, reject) => {
			const parserTemplate = new TemplateParser(paths);
			parserTemplate
				.parse()
				.then(() => fulfill([...parserTemplate.templates]))
				.catch(e => reject(e));
		});
	}

	_loadPaths(paths) {
		let promises = [];
		for (let curPath of paths) {
			promises.push(this._loadPath(curPath));
		}

		return Promise.all(promises).then(paths =>
			paths.reduce((allPaths, curPaths) => allPaths.concat(curPaths), [])
		);
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

module.exports = ConvertService;

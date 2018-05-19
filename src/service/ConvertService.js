const fs = require('fs');
const path = require('path');
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
		return this._clearOutputDirectory()
			.then(() => this._loadPaths(this._paths))
			.then(paths => this._loadTemplates(paths))
			.then(tmpls => (this._originalTmpl = tmpls))
			.catch(e => {
				throw e;
			});
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
				// then convert jquery templates
				const convTmpls = hbsConverter.convert(originalTmplData);
				this._convertedTmpl = this._convertedTmpl.concat(convTmpls);

				this._saveTemplatesToFiles(this._convertedTmpl)
					.then(() => {
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

	_clearOutputDirectory() {
		return new Promise((fulfill, reject) => {
			if (this._clearOutputDir === false) {
				fulfill();
				return;
			}

			fs.readdir(this._outputDir, (err, files) => {
				if (err) {
					reject(err);
					return;
				}

				for (let file of files) {
					fs.unlinkSync(path.join(this._outputDir, file));
				}

				fulfill();
			});
		});
	}

	_saveTemplatesToFiles(convertTemplates) {
		return new Promise((fulfill, reject) => {
			// we can have multiple templates in single file so we need to group
			// files by path
			const filePathGroup = convertTemplates.reduce((group, curTmpl) => {
				if (!group[curTmpl.path]) {
					group[curTmpl.path] = [];
				}

				group[curTmpl.path].push(curTmpl);

				return group;
			}, {});

			const tmplFilePromise = [];
			// save all templates from each group
			for (let curPath in filePathGroup) {
				// join all templates from single group
				let joinedTmpl = filePathGroup[curPath]
					.map(curTmpl => curTmpl.html)
					.join('\n'.repeat(2));

				// manage async in file save
				tmplFilePromise.push(
					this._saveTemplateFile(curPath, joinedTmpl)
				);
			}

			// wait all templates to be saved before resolving promise
			Promise.all(tmplFilePromise)
				.then(fulfill)
				.catch(reject);
		});
	}

	_saveTemplateFile(path, value) {
		return new Promise((fulfill, reject) => {
			fs.writeFile(path, value, err => {
				if (err) {
					reject(err);
					return;
				}

				fulfill();
			});
		});
	}
}

module.exports = ConvertService;

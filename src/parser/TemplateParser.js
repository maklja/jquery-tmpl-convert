const cheerio = require('cheerio');
const glob = require('glob');
const fs = require('fs');
const TemplateModel = require('../model/TemplateModel');
const Parser = require('./Parser');

module.exports = class TemplateParser {
	get templates() {
		return this._templateModels;
	}

	constructor(paths, options) {
		this._paths = paths;
		this._options = Object.assign({ encoding: 'utf8' }, options);
		this._templateModels = null;
	}

	loadTemplates() {
		this._templateModels = [];
		let pathPromises = [];
		for (let curPath of this._paths) {
			pathPromises.push(this._loadTemplate(curPath));
		}

		return Promise.all(pathPromises);
	}

	_loadTemplate(path) {
		return new Promise((fulfill, reject) => {
			// use glob to support regex in path
			glob(path, (err, filePaths) => {
				if (err) {
					if (err) {
						reject(err);
					}
				}

				let readAllTemplateContent = [];
				for (let curFilePath of filePaths) {
					readAllTemplateContent.push(this._readFile(curFilePath));
				}

				Promise.all(readAllTemplateContent)
					.then(fulfill)
					.catch(reject);
			});
		});
	}

	_readFile(path) {
		return new Promise((fulfill, reject) => {
			fs.readFile(path, this._options.encoding, (err, templateData) => {
				if (err) {
					reject(err);
				}

				this._extractTemplates(templateData, path);

				// resolve promise
				fulfill();
			});
		});
	}

	_extractTemplates(templateData, path) {
		// parse template html
		let $ = cheerio.load(templateData),
			// one html file can contain multiple template script tags
			// so extract them all
			templates = $('script');

		// create template model for each template
		templates.each((i, curTemplate) => {
			let templateId = curTemplate.attribs['id'],
				type = curTemplate.attribs['type'];

			if (templateId && type === 'text/x-jquery-tmpl') {
				this._templateModels.push(
					new TemplateModel(
						templateId,
						type,
						path,
						// get text inside script tag
						curTemplate.children[0].nodeValue
					)
				);
			}
		});
	}

	parse() {
		return new Promise((fulfill, reject) => {
			if (this._templateModels == null) {
				this.loadTemplates()
					.then(() => {
						this._parseTemplates();
						fulfill();
					})
					.catch(e => {
						reject(e);
					});
			} else {
				this._parseTemplates();
				fulfill();
			}
		});
	}

	_parseTemplates() {
		for (let curTmplModel of this._templateModels) {
			const parser = new Parser(curTmplModel.value);
			parser.parse();

			curTmplModel.errors = parser.parseErrors;
			if (curTmplModel.errors.length === 0) {
				curTmplModel.tokenNodes = parser.getNodeTree();
			}
		}
	}
};

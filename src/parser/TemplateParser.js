const cheerio = require('cheerio');
const fs = require('fs');
const TemplateModel = require('../model/TemplateModel');
const Parser = require('./Parser');
const { extractTemplateHTML } = require('../utils/helpers');

const SUPPORTED_SCRIPT_TYPE = 'text/x-jquery-tmpl';

module.exports = class TemplateParser {
	get templates() {
		return this._templateModels;
	}

	constructor(paths, options) {
		this._paths = paths;
		this._options = Object.assign(
			{ encoding: 'utf8', removeTabs: false },
			options
		);
		this._templateModels = null;
	}

	loadTemplates() {
		this._templateModels = [];
		let pathPromises = [];
		for (let curPath of this._paths) {
			pathPromises.push(this._readFile(curPath));
		}

		return Promise.all(pathPromises);
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

			if (templateId && type === SUPPORTED_SCRIPT_TYPE) {
				const $node = cheerio.load(curTemplate),
					outerHTML = $node.html().trim(),
					innerHTML = curTemplate.children[0].nodeValue;

				this._templateModels.push(
					new TemplateModel(
						templateId,
						type,
						path,
						// get text inside script tag
						innerHTML,
						outerHTML
					)
				);
			}
		});
	}

	static extractTemplateHTML(templateData) {
		return extractTemplateHTML(templateData);
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
			const parser = new Parser(curTmplModel.value, true, {
				removeTabs: this._options.removeTabs
			});
			parser.parse();

			curTmplModel.errors = parser.parseErrors;
			if (curTmplModel.errors.length === 0) {
				curTmplModel.tokenNodes = parser.getNodeTree();
			}
		}
	}
};

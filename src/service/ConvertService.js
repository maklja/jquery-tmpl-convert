const glob = require('glob');
const TemplateParser = require('../parser/TemplateParser');

class ConvertService {
	get converters() {
		return this._converters;
	}

	constructor(converters, paths) {
		this._paths = paths;
		this._originalTmpl = [];
		this._convertedTmpl = new Map();
		this._converters = new Map(
			converters.map(curConv => [curConv.id, curConv])
		);
	}

	initialize() {
		return this._loadPaths(this._paths)
			.then(paths => this._loadTemplates(paths))
			.then(tmpls => (this._originalTmpl = tmpls));
	}

	addConverter(converter) {
		this._converters.add(converter.id, converter);
	}

	getConverter(convId) {
		const converter = this._converters.get(convId);
		if (!converter) {
			throw new Error(`Converter with id ${convId} is not found.`);
		}

		return converter;
	}

	convertTemplate(convId, tmplGuid) {
		const tmplToConvert = this._originalTmpl.find(
				curTmpl => curTmpl.guid === tmplGuid
			),
			i = this._originalTmpl.indexOf(tmplToConvert);

		if (tmplToConvert == null) {
			throw new Error(`Template with guid ${tmplGuid} is not found.`);
		}

		const converter = this.getConverter(convId);

		// then convert jquery templates
		const convTmpls = converter.convert([tmplToConvert]);
		// there will be only one element
		const convTmpl = convTmpls.pop();

		// replace template inside the cache
		const cachedConvTmpls = this._convertedTmpl.get(convId);
		cachedConvTmpls[i] = convTmpl;

		return convTmpl.toJSON();
	}

	convertTemplates(convId, index = 0, limits = 0) {
		const converter = this.getConverter(convId);
		let cachedConvTmpls = this._convertedTmpl.get(convId);

		if (cachedConvTmpls == null) {
			cachedConvTmpls = [];
			this._convertedTmpl.set(convId, cachedConvTmpls);
		}

		// include already converted templates to prevent double conversion
		let fromIndex = index === 0 ? cachedConvTmpls.length : index,
			// max templates to convert
			toIndex = limits === 0 ? this._originalTmpl.length : index + limits,
			// original templates that will be converteds
			originalTmplData = this._originalTmpl.slice(index, toIndex);

		if (cachedConvTmpls.length < toIndex) {
			// then convert jquery templates
			const convTmpls = converter.convert(
				// take just templates that are not converted already
				this._originalTmpl.slice(fromIndex, toIndex)
			);

			cachedConvTmpls.push(...convTmpls);
		}

		return {
			originalTemplates: originalTmplData,
			convertedTemplates: cachedConvTmpls.slice(index, toIndex),
			index:
				toIndex < this._originalTmpl.length
					? toIndex
					: this._originalTmpl.length,
			maxTmpls: this._originalTmpl.length
		};
	}

	updateTemplate(convId, tmplGuid, tmplHTML) {
		const updatedTmplData = TemplateParser.extractTemplateHTML(tmplHTML);

		if (updatedTmplData.length === 0) {
			throw new Error('Script tag is not found.');
		}

		if (updatedTmplData.length > 1) {
			throw new Error('Multiple script tags found.');
		}

		const convTemplates = this._convertedTmpl.get(convId);
		const tmplModel = convTemplates.find(
			curTmpl => curTmpl.guid === tmplGuid
		);

		if (tmplModel == null) {
			throw new Error(`Template with guid ${tmplGuid} is not found.`);
		}

		// update template
		const tmplDelta = updatedTmplData[0];
		tmplModel.value = tmplDelta.innerHTML;
		tmplModel.html = tmplDelta.outerHTML;

		return tmplModel.toJSON();
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
					reject(err);
					return;
				}

				fulfill(filePaths);
			});
		});
	}
}

module.exports = ConvertService;

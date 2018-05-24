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

	convertTemplates(convId, index = 0, limits = 0) {
		const converter = this._converters.get(convId);
		if (!converter) {
			throw new Error(`Converter with id ${convId} is not found.`);
		}
		// prepair converter
		let toIndex = limits === 0 ? this._originalTmpl.length : index + limits,
			originalTmplData = this._originalTmpl.slice(index, toIndex);

		if (this._convertedTmpl.length >= toIndex) {
			// send response to the client
			return {
				originalTemplates: originalTmplData,
				convertedTemplates: this._convertedTmpl.slice(index, toIndex),
				index:
					toIndex < this._originalTmpl.length
						? toIndex
						: this._originalTmpl.length,
				maxTmpls: this._originalTmpl.length
			};
		} else {
			// then convert jquery templates
			const convTmpls = converter.convert(originalTmplData);
			let cachedConvTmpls = this._convertedTmpl.get(convId);

			if (cachedConvTmpls == null) {
				cachedConvTmpls = [];
				this._convertedTmpl.set(convId, cachedConvTmpls);
			}

			cachedConvTmpls = cachedConvTmpls.concat(convTmpls);

			return {
				originalTemplates: originalTmplData,
				convertedTemplates: convTmpls,
				index:
					toIndex < this._originalTmpl.length
						? toIndex
						: this._originalTmpl.length,
				maxTmpls: this._originalTmpl.length
			};
		}
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

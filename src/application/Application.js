const express = require('express');
const path = require('path');
const fs = require('fs');
const ConvertService = require('../service/ConvertService');
const REPORT_FILE_NAME = 'report.txt';

class Application {
	constructor(config) {
		this._config = config;
	}

	start(converters) {
		const convInstances = converters.map(
			Converter => new Converter(this._config)
		);

		this.convertService = new ConvertService(
			convInstances,
			this._config.files
		);
		this.convertService
			.initialize()
			.then(() => {
				if (this._config.server) {
					this._startServer();
				} else {
					return this._convertTemplates();
				}
			})
			.catch(err => {
				// eslint-disable-next-line no-console
				console.error(err);
			});
	}

	_startServer() {
		const app = express();
		this._setRoutes(app);
		app.use(express.json());
		app.use(express.static(path.join(__dirname, '../public')));

		app.listen(3000, () =>
			// eslint-disable-next-line no-console
			console.log('Example app listening on port 3000!')
		);
	}

	_convertTemplates() {
		// using service convert template
		const template = this.convertService.convertTemplates(
			this._config.converter
		);

		// clean up output directyory first
		return this._clearOutputDirectory()
			.then(() =>
				// then save all converted templates
				// and generate txt report
				Promise.all([
					this._saveTemplatesToFiles(template.convertedTemplates),
					this._createReport(template.convertedTemplates)
				])
			)
			.then(() =>
				// eslint-disable-next-line no-console
				console.log(
					`Converted ${template.convertedTemplates.length} templates`
				)
			);
	}

	_createReport(convTemplates) {
		const report = convTemplates
			// create error messages for output report
			.map(curTmpl => {
				if (curTmpl.errors.length > 0) {
					let errorMsg = curTmpl.path;
					curTmpl.errors.forEach(curErr => {
						errorMsg += `\n\t ${curErr.code} - ${curErr.type}: ${
							curErr.message
						} - line number ${curErr.lineNumber}`;
					});

					return errorMsg;
				}

				return null;
			})
			// remove all messaged that doesn't have any message type
			.filter(curMsg => curMsg != null)
			// merge all messages into one file
			.join('\n'.repeat(2));

		// save report in output directory
		return this._saveFile(
			path.join(this._config.output, REPORT_FILE_NAME),
			report
		);
	}

	_clearOutputDirectory() {
		return new Promise((fulfill, reject) => {
			// create output directory if doesn't exits
			if (fs.existsSync(this._config.output) === false) {
				fs.mkdirSync(this._config.output);
				fulfill();
				return;
			}

			// read all files in output directory and delete them
			fs.readdir(this._config.output, (err, files) => {
				if (err) {
					reject(err);
					return;
				}

				for (let file of files) {
					fs.unlinkSync(path.join(this._config.output, file));
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
				tmplFilePromise.push(this._saveFile(curPath, joinedTmpl));
			}

			// wait all templates to be saved before resolving promise
			Promise.all(tmplFilePromise)
				.then(fulfill)
				.catch(reject);
		});
	}

	_saveFile(path, value) {
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

	_setRoutes(app) {
		app.get('/', (req, res) =>
			res.sendFile(path.join(__dirname, '../public/index.html'))
		);

		const isNumeric = n => {
			return !isNaN(parseFloat(n)) && isFinite(n);
		};

		app.get('/convert', (req, res) => {
			const { conv, index, limit } = req.query,
				indexNum = parseInt(index),
				limitNum = parseInt(limit);

			if (!isNumeric(indexNum) || !isNumeric(limitNum)) {
				res.status(400);
				res.send({ err: 'Invalid request parameters.' });

				return;
			}

			if (limitNum <= 0) {
				res.status(400);
				res.send({
					err:
						'Invalid request parameter limit must be greater then 0..'
				});

				return;
			}

			try {
				const templates = this.convertService.convertTemplates(
					conv,
					indexNum,
					limitNum
				);

				res.send(templates);
			} catch (e) {
				res.status(400);
				res.send({ err: e.message });
			}
		});

		app.get('/converters', (req, res) => {
			const converters = Array.from(
				this.convertService.converters.values()
			).map(curConv => ({
				id: curConv.id,
				name: curConv.name
			}));

			res.send(converters);
		});
	}
}

module.exports = Application;

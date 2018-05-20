const express = require('express');
const path = require('path');
const fs = require('fs');
const ConvertService = require('../service/ConvertService');

class Application {
	constructor(configPath, useServer) {
		this._configPath = configPath;
		this._useServer = useServer;
	}

	start(converters) {
		this._loadConfiguration()
			.then(config => {
				const convInstances = converters.map(
					Converter => new Converter(config)
				);

				this.convertService = new ConvertService(convInstances, config);
				return this.convertService.initialize();
			})
			.then(() => {
				if (this._useServer) {
					this._startServer();
				} else {
					this._convertTemplates();
				}
			})
			.catch(err => {
				console.error(
					`Unable to load configuration from path ${
						this._configPath
					}, wtih message: ${err}`
				);
			});
	}

	_startServer() {
		const app = express();
		this._setRoutes(app);
		app.use(express.json());
		app.use(express.static(path.join(__dirname, '../public')));

		app.listen(3000, () =>
			console.log('Example app listening on port 3000!')
		);
	}

	_convertTemplates() {
		this.convertService
			.convertTemplates()
			.then(report =>
				console.log(`Converted ${report.convertedTemplates.length}`)
			)
			.catch(err => console.error(err));
	}

	_loadConfiguration() {
		return new Promise((fulfill, reject) => {
			// read configuration before starting the server
			fs.readFile(path.resolve(this._configPath), 'utf8', (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				fulfill(JSON.parse(data));
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

			this.convertService
				.convertTemplates(conv, indexNum, limitNum)
				.then(templates => {
					res.send(templates);
				})
				.catch(e => {
					res.status(400);
					res.send({ err: e.message });
				});
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

const express = require('express');
const path = require('path');
const fs = require('fs');
const ConvertService = require('../service/ConvertService');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

class Application {
	constructor(configPath) {
		this._configPath = configPath;

		this._setRoutes();
	}

	start() {
		this._loadConfiguration()
			.then(config => {
				this.convertService = new ConvertService(config);
				return this.convertService.initialize();
			})
			.then(() =>
				app.listen(3000, () =>
					console.log('Example app listening on port 3000!')
				)
			)
			.catch(err => {
				console.error(
					`Unable to load configuration from path ${
						this._configPath
					}, wtih message: ${err}`
				);
			});
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

	_setRoutes() {
		app.get('/', (req, res) =>
			res.sendFile(path.join(__dirname, '../public/index.html'))
		);

		const isNumeric = n => {
			return !isNaN(parseFloat(n)) && isFinite(n);
		};

		app.get('/convert', (req, res) => {
			const { index, limit } = req.query,
				indexNum = parseInt(index),
				limitNum = parseInt(limit);

			if (!isNumeric(indexNum) || !isNumeric(limitNum)) {
				res.status(400);
				res.send({ err: 'Invalid request parameters.' });

				return;
			}

			this.convertService
				.convertTemplates(indexNum, limitNum)
				.then(templates => {
					res.send(templates);
				})
				.catch(e => {
					res.status(400);
					res.send({ err: e.message });
				});
		});
	}
}

module.exports = Application;

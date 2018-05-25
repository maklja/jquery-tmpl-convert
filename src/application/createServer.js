const express = require('express');
const path = require('path');
const Zip = require('node-zip');
const DOWNLOAD_ZIP_NAME = 'templates';

const setRoutes = (app, convertService) => {
	const isNumeric = n => {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};

	app.get('/', (req, res) =>
		res.sendFile(path.join(__dirname, '../public/index.html'))
	);

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
				err: 'Invalid request parameter limit must be greater then 0.'
			});

			return;
		}

		try {
			const templates = convertService.convertTemplates(
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
		const converters = Array.from(convertService.converters.values()).map(
			curConv => ({
				id: curConv.id,
				name: curConv.name
			})
		);

		res.send(converters);
	});

	app.get('/downloadConverted', (req, res) => {
		const { conv } = req.query;
		const { convertedTemplates } = convertService.convertTemplates(conv);

		const zip = new Zip();

		convertedTemplates.forEach(curTmpl =>
			zip.file(curTmpl.path, curTmpl.html)
		);
		const zipData = zip.generate({
			base64: false,
			compression: 'DEFLATE'
		});

		res.set('Content-Type', 'application/zip');
		res.set(
			'Content-Disposition',
			`attachment; filename=${DOWNLOAD_ZIP_NAME}.zip`
		);
		res.set('Content-Length', zipData.length);
		res.end(zipData, 'binary');
	});
};

module.exports = (convertService, config) => {
	const app = express();
	setRoutes(app, convertService);
	app.use(express.json());
	app.use(express.static(path.join(__dirname, '../public')));

	app.listen(config.port, () =>
		// eslint-disable-next-line no-console
		console.log(`Example app listening on port ${config.port}!`)
	);
};

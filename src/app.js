const express = require('express');
const path = require('path');
const app = express();
const convertService = require('./service/ConvertService');

app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) =>
	res.sendFile(path.join(__dirname, './public/index.html'))
);

const isNumeric = n => {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

app.get('/convert', function(req, res) {
	const { pathIndex, limit } = req.query,
		pathIndexNum = parseInt(pathIndex),
		limitNum = parseInt(limit);

	if (!isNumeric(pathIndexNum) || !isNumeric(limitNum)) {
		res.status(400);
		res.send('Invalid request parameters.');

		return;
	}

	const promise = convertService.convertTemplates(pathIndexNum, limitNum);

	promise.then(templates => {
		res.end(JSON.stringify(templates));
	});
});

convertService
	.initialize()
	.then(() => {
		app.listen(3000, () =>
			console.log('Example app listening on port 3000!')
		);
	})
	// TODO kill app?
	.catch(err => err);

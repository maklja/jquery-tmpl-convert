const express = require('express');
const path = require('path');
const app = express();
const convertService = require('./service/ConvertService');

app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) =>
	res.sendFile(path.join(__dirname, './public/index.html'))
);

app.post('/loadTemplates', function(req, res) {
	let paths = req.body.paths,
		promise = convertService.loadTemplates(paths);

	promise.then(templates => {
		res.end(JSON.stringify(templates));
	});
});

app.get('/convert', function(req, res) {
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

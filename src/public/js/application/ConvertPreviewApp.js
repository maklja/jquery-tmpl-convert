import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from 'app-js/view/pages/HomePage';
import 'app-css/default.css';

class ConvertPreviewApp {
	constructor() {
		this._mainContainer = document.getElementById('main-container');
	}

	start() {
		this._fetchTemplates().then(tmpls => {
			ReactDOM.render(
				<HomePage templates={tmpls} />,
				this._mainContainer
			);
		});
	}

	_fetchTemplates() {
		return new Promise((fulfill, reject) => {
			window
				.fetch('/loadTemplates', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						paths: [
							'/home/maklja/test/node_test/test/converter/**/*.html'
						]
					})
				})
				.then(response => {
					return response.json();
				})
				.then(json => {
					fulfill(json);
				})
				.catch(ex => {
					reject(ex);
				});
		});
	}
}

export default ConvertPreviewApp;

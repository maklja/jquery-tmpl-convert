import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from 'app-js/view/pages/HomePage';
import 'app-css/default.css';

class ConvertPreviewApp {
	constructor() {
		this._mainContainer = document.getElementById('main-container');
	}

	start() {
		return this._convertTemplates().then(convertTemplates => {
			ReactDOM.render(
				<HomePage templates={convertTemplates} />,
				this._mainContainer
			);
		});
	}

	_convertTemplates() {
		return new Promise((fulfill, reject) => {
			window
				.fetch('/convert', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					}
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

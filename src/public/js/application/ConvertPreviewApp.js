import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from 'app-js/view/pages/HomePage';
import 'app-css/default.css';

class ConvertPreviewApp {
	constructor() {
		this._mainContainer = document.getElementById('main-container');
	}

	start() {
		ReactDOM.render(<HomePage />, this._mainContainer);
	}
}

export default ConvertPreviewApp;

import 'whatwg-fetch';
import 'babel-polyfill';
import ConvertPreviewApp from 'app-js/application/ConvertPreviewApp';

document.addEventListener('DOMContentLoaded', () => {
	let app = new ConvertPreviewApp();
	app.start();
});

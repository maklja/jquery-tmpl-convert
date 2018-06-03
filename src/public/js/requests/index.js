export const convertTemplates = (selectedConverterId, index, limit) => {
	return new Promise((fulfill, reject) => {
		const url = `/convert?conv=${selectedConverterId}&index=${index}&limit=${limit}`;
		window
			.fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(response => {
				if (response.ok === false) {
					throw response;
				}

				return response.json();
			})
			.then(json => fulfill(json))
			.catch(errResp =>
				errResp.json().then(errObj => reject(errObj.err))
			);
	});
};

export const updateTemplate = (converterId, tmplGuid, htmlText) => {
	return new Promise((fulfill, reject) => {
		const url = `/updateTemplate`;
		window
			.fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					templateUpdate: {
						converterId,
						guid: tmplGuid,
						html: htmlText
					}
				})
			})
			.then(response => {
				if (response.ok === false) {
					throw response;
				}

				return response.json();
			})
			.then(newTmplModel => {
				fulfill(newTmplModel);
			})
			.catch(errResp => {
				errResp.json().then(errObj => reject(errObj));
			});
	});
};

export const convertTemplate = (converterId, tmplGuid) => {
	return new Promise((fulfill, reject) => {
		const url = '/convertTemplate';
		window
			.fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					convertTemplate: {
						converterId,
						guid: tmplGuid
					}
				})
			})
			.then(response => {
				if (response.ok === false) {
					throw response;
				}

				return response.json();
			})
			.then(newTmplModel => fulfill(newTmplModel))
			.catch(errResp => {
				errResp.json().then(errObj => reject(errObj));
			});
	});
};

export const loadConverters = () => {
	return new Promise((fulfill, reject) => {
		const url = '/converters';
		window
			.fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(response => {
				if (response.ok === false) {
					throw response;
				}

				return response.json();
			})
			.then(converters => fulfill(converters))
			.catch(errResp =>
				errResp.json().then(errObj => reject(errObj.err))
			);
	});
};

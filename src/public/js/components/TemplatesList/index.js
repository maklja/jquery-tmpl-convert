import React from 'react';
import TemplatePreview from 'app-js/components/TemplatePreview';
import './template_list_preview.css';

class TemplatesList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			templates: {
				originalTemplates: [],
				convertedTemplates: []
			},
			pathIndex: 0,
			// set init count paths to be null to force init fetch
			countPaths: null,
			isLoading: false
		};

		this._onScroll = this._onScroll.bind(this);
	}

	componentWillMount() {
		this._loadNextTemplates();

		document.addEventListener('scroll', this._onScroll);
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this._onScroll);
	}

	render() {
		const { templates, isLoading } = this.state;
		const originalTemplates = templates.originalTemplates.map(
			curTemplate => (
				<TemplatePreview
					key={`${curTemplate.path}_${curTemplate.id}`}
					template={curTemplate}
				/>
			)
		);
		const convertedTemplates = templates.convertedTemplates.map(
			curTemplate => (
				<TemplatePreview
					key={`${curTemplate.path}_${curTemplate.id}`}
					template={curTemplate}
				/>
			)
		);

		return (
			<div>
				{originalTemplates.map((curTmpl, i) => (
					<div key={i} className="templates-preview">
						<div className="templates-preview-container">
							{curTmpl}
						</div>
						<div className="templates-preview-container">
							{convertedTemplates[i]}
						</div>
					</div>
				))}
				{isLoading ? (
					<div className="templates-loading">Loading...</div>
				) : (
					''
				)}
			</div>
		);
	}

	_loadNextTemplates() {
		const { isLoading, pathIndex, countPaths } = this.state;

		if (isLoading || pathIndex === countPaths) {
			return;
		}

		this.setState({
			isLoading: true
		});
		this._convertTemplates(pathIndex, 10).then(convTmpl => {
			this.setState(prevState => {
				const {
					originalTemplates,
					convertedTemplates
				} = prevState.templates;

				return {
					templates: {
						originalTemplates: originalTemplates.concat(
							convTmpl.originalTemplates
						),
						convertedTemplates: convertedTemplates.concat(
							convTmpl.convertedTemplates
						)
					},
					pathIndex: prevState.pathIndex + convTmpl.pathIndex,
					countPaths: convTmpl.countPaths,
					isLoading: false
				};
			});
		});
	}

	_convertTemplates(pathIndex, limit) {
		const url = `/convert?pathIndex=${pathIndex}&limit=${limit}`;
		return new Promise((fulfill, reject) => {
			window
				.fetch(url, {
					method: 'GET',
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

	_onScroll() {
		const { isLoading } = this.state;
		const html = document.documentElement;
		const body = document.body;
		const maxHeight = body.offsetHeight * 0.9;

		if (isLoading) {
			return;
		}

		if (body.scrollTop > maxHeight || html.scrollTop > maxHeight) {
			this._loadNextTemplates();
		}
	}
}

export default TemplatesList;

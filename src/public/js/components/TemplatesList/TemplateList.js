import React from 'react';
import PropTypes from 'prop-types';
import TemplatePreview from 'app-js/components/TemplatePreview';
import './template_list_preview.css';
import ModalDialog from './ModalDialog';

function isElementInViewport(rect) {
	var pageTop = window.pageYOffset;
	var pageBottom = pageTop + window.innerHeight;
	var elementTop = rect.top;
	var elementBottom = elementTop + rect.height;
	return elementTop <= pageBottom && elementBottom >= pageTop;
}

const TemplatesListHeader = ({
	converters,
	selectedConverter,
	count,
	onCoverterChange
}) => {
	return (
		<div className="templates-header">
			<div className="controlls">
				<select
					className="controll"
					value={selectedConverter}
					onChange={onCoverterChange}
				>
					{converters.map(curConv => (
						<option key={curConv.id} value={curConv.id}>
							{curConv.name}
						</option>
					))}
				</select>
				<form method="GET" action="downloadConverted">
					<input
						type="hidden"
						name="conv"
						value={selectedConverter}
					/>
					<button className="controll" type="submit">
						Download
					</button>
				</form>
			</div>
			<div>
				<span>Templates count: {count}</span>
			</div>
		</div>
	);
};

TemplatesListHeader.propTypes = {
	converters: PropTypes.array.isRequired,
	selectedConverter: PropTypes.string.isRequired,
	count: PropTypes.number,
	onCoverterChange: PropTypes.func
};

TemplatesListHeader.defaultProps = {
	count: 0,
	onCoverterChange: () => {}
};

class TemplatesList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			templates: {
				originalTemplates: [],
				convertedTemplates: []
			},
			index: 0,
			// set init count paths to be null to force init fetch
			maxTmpls: null,
			isLoading: false,
			modalIsOpen: false,
			modalTmplModel: null,
			converters: [],
			selectedConverterId: '',
			error: null,
			visibleElements: []
		};

		this.bodyEl = React.createRef();

		this._onScroll = this._onScroll.bind(this);
		this._openModal = this._openModal.bind(this);
		this._onModelChange = this._onModelChange.bind(this);
		this._onModalClose = this._onModalClose.bind(this);
		this._onCoverterChange = this._onCoverterChange.bind(this);

		this._offsetHeights = [];
	}

	componentDidMount() {
		// first load supported converters
		this._loadConverters()
			.then(() => this._loadNextTemplates())
			.catch(err => this.setState({ error: err }));

		document.addEventListener('scroll', this._onScroll);
	}

	componentDidUpdate() {
		const { templates } = this.state;

		if (templates.originalTemplates.length > this._offsetHeights.length) {
			const templateEl = Array.from(this.bodyEl.current.children).filter(
				curEl => curEl.classList.contains('templates')
			);
			this._offsetHeights = this._offsetHeights.concat(
				templateEl.slice(this._offsetHeights.length).map(x => {
					return {
						top: x.offsetTop,
						height: x.getBoundingClientRect().height
					};
				})
			);
		}
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this._onScroll);
	}

	render() {
		const {
			templates,
			isLoading,
			maxTmpls,
			modalIsOpen,
			modalTmplModel,
			converters,
			selectedConverterId,
			error,
			visibleElements
		} = this.state;

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
					onOpenModal={this._openModal}
				/>
			)
		);

		return (
			<div>
				<div className="templates-title">
					<TemplatesListHeader
						converters={converters}
						selectedConverter={selectedConverterId}
						count={maxTmpls}
						onCoverterChange={this._onCoverterChange}
					/>
				</div>
				<div ref={this.bodyEl} className="templates-body">
					{error == null ? (
						originalTemplates.map(
							(curTmpl, i) =>
								visibleElements.indexOf(i) > -1 ||
								this._offsetHeights.length <= i ? (
									<div key={i} className="templates">
										<div className="templates-index">
											{i + 1}
										</div>
										<div className="templates-preview">
											<div className="templates-preview-container">
												{curTmpl}
											</div>
											<div className="templates-preview-container">
												{convertedTemplates[i]}
											</div>
										</div>
									</div>
								) : (
									<div
										key={i}
										className="templates"
										style={{
											height: this._offsetHeights[i]
												.height
										}}
									/>
								)
						)
					) : (
						<div className="template-convert-error">{error}</div>
					)}
					{isLoading && error == null ? (
						<div className="templates-loading">Loading...</div>
					) : (
						''
					)}
				</div>
				<div className="templates-footer">
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="http://web.archive.org/web/20120920065217/http://api.jquery.com/category/plugins/templates/"
					>
						JQuery template docs
					</a>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="http://tryhandlebarsjs.com/"
					>
						Try handlebars
					</a>
				</div>
				<ModalDialog
					converterId={selectedConverterId}
					isOpen={modalIsOpen}
					onModalClose={this._onModalClose}
					tmplModel={modalTmplModel}
					onModelChange={this._onModelChange}
				/>
			</div>
		);
	}

	_onModelChange(changedModel) {
		this.setState(prevState => {
			const { templates, modalTmplModel } = prevState;

			return Object.assign({}, prevState, {
				templates: {
					originalTemplates: [...templates.originalTemplates],
					// replace changed model in collection
					convertedTemplates: templates.convertedTemplates.map(
						curTmplModel =>
							curTmplModel.id === changedModel.id
								? changedModel
								: curTmplModel
					)
				},
				// if currently open template model is changed, change it in the state
				modalTmplModel:
					modalTmplModel.id === changedModel.id
						? changedModel
						: modalTmplModel
			});
		});
	}

	_loadNextTemplates() {
		const { isLoading, index, maxTmpls } = this.state;
		const { tmplsToFetch } = this.props;

		if (isLoading || index === maxTmpls) {
			return;
		}

		this.setState({
			isLoading: true
		});
		this._convertTemplates(index, tmplsToFetch)
			.then(convTmpl => {
				this.setState(prevState => {
					const {
						originalTemplates,
						convertedTemplates
					} = prevState.templates;

					return Object.assign({}, prevState, {
						templates: {
							originalTemplates: originalTemplates.concat(
								convTmpl.originalTemplates
							),
							convertedTemplates: convertedTemplates.concat(
								convTmpl.convertedTemplates
							)
						},
						index: convTmpl.index,
						maxTmpls: convTmpl.maxTmpls,
						isLoading: false
					});
				});
			})
			.catch(err => this.setState({ error: err }));
	}

	_loadConverters() {
		const url = '/converters';
		return new Promise((fulfill, reject) => {
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
				.then(converters =>
					this.setState(
						{
							converters: converters,
							selectedConverterId: converters[0].id
						},
						() => fulfill()
					)
				)
				.catch(errResp =>
					errResp.json().then(errObj => reject(errObj.err))
				);
		});
	}

	_convertTemplates(index, limit) {
		const { selectedConverterId } = this.state;
		const url = `/convert?conv=${selectedConverterId}&index=${index}&limit=${limit}`;
		return new Promise((fulfill, reject) => {
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
	}

	_onScroll() {
		const { isLoading } = this.state;

		if (isLoading) {
			return;
		}

		const html = document.documentElement;
		const MIN_OFFSET_BEFORE_LOADING = 200; // px
		const maxHeight = html.scrollHeight - html.scrollTop;

		if (html.clientHeight + MIN_OFFSET_BEFORE_LOADING > maxHeight) {
			this._loadNextTemplates();
		} else {
			const visibleElIndex = this._offsetHeights
				.filter(rect => {
					return isElementInViewport(rect);
				})
				.map(rect => this._offsetHeights.indexOf(rect));

			this.setState({
				visibleElements: visibleElIndex
			});
		}
	}

	_onCoverterChange(e) {
		this.setState({
			selectedConverterId: e.currentTarget.value,
			index: 0
		});
	}

	_openModal(tmplModel) {
		this.setState({
			modalIsOpen: true,
			modalTmplModel: tmplModel
		});
	}

	_onModalClose() {
		this.setState({
			modalIsOpen: false,
			modalTmplModel: null
		});
	}
}

TemplatesList.propTypes = {
	tmplsToFetch: PropTypes.number
};

TemplatesList.defaultProps = {
	tmplsToFetch: 20
};

export default TemplatesList;

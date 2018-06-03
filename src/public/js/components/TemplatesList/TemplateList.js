import React from 'react';
import PropTypes from 'prop-types';
import {
	TemplatePreview,
	TemplatePreviewLoading
} from 'app-js/components/TemplatePreview';
import { convertTemplates, loadConverters } from 'app-js/requests';
import './template_list_preview.css';
import ModalDialog from './ModalDialog';

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

const TemplatesListFooter = () => {
	return (
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
	);
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
		loadConverters()
			.then(converters => {
				this.setState(
					{
						converters: converters,
						selectedConverterId: converters[0].id
					},
					() => this._loadNextTemplates()
				);
			})
			.catch(err => this.setState({ error: err }));

		document.addEventListener('scroll', this._onScroll);
	}

	componentDidUpdate(prevProps, prevState) {
		const { templates, visibleElements } = this.state;
		// get all children from template body that contains class templates
		const templateEl = Array.from(this.bodyEl.current.children).filter(
			curEl => curEl.classList.contains('templates')
		);

		// if there is more template in DOM then we have in offsetHeights then program
		// lazy loaded more templates and we need to get there heights and top offset
		if (templates.originalTemplates.length > this._offsetHeights.length) {
			// add new DOM elements height to collection
			this._offsetHeights = this._offsetHeights.concat(
				templateEl.slice(this._offsetHeights.length).map(x => {
					return {
						top: x.offsetTop,
						height: x.getBoundingClientRect().height
					};
				})
			);
		}

		let isUpdated = false;
		// first we need to check is some of visible elements is changed it
		// height this is only posible if user manually update some template
		// (using edit template option through modal dialog)
		visibleElements.forEach(curElIndex => {
			const curEl = templateEl[curElIndex];
			const height = curEl.getBoundingClientRect().height;
			// if diffrence between current height and prevous height is larger then
			// 20px we will consider that template is changed
			if (
				Math.abs(height - this._offsetHeights[curElIndex].height) > 20
			) {
				this._offsetHeights[curElIndex].top = curEl.offsetTop;
				this._offsetHeights[curElIndex].height = height;
				isUpdated = true;
			}
		});

		// if at least one template is changed then we need to update top offset
		// of all elements bellow it in order to support smooth scroling without bugs
		if (isUpdated) {
			const firstInvisibleElIndex =
				visibleElements[visibleElements.length - 1] + 1;
			const elementsToUpdateTop = this._offsetHeights.slice(
				firstInvisibleElIndex
			);

			elementsToUpdateTop.forEach((curEl, i) => {
				curEl.top = templateEl[firstInvisibleElIndex + i].offsetTop;
			});
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
			modalTmplOrig,
			converters,
			selectedConverterId,
			error,
			visibleElements
		} = this.state;

		const originalTemplates = templates.originalTemplates.map(
			curTemplate => (
				<TemplatePreview
					key={`${curTemplate.guid}`}
					template={curTemplate}
				/>
			)
		);
		const convertedTemplates = templates.convertedTemplates.map(
			(curTemplate, i) => (
				<TemplatePreview
					key={`${curTemplate.guid}`}
					template={curTemplate}
					originalTemplate={templates.originalTemplates[i]}
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
								visibleElements.length === 0 ||
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
									<TemplatePreviewLoading
										key={i}
										height={this._offsetHeights[i].height}
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
				<TemplatesListFooter />
				<ModalDialog
					converterId={selectedConverterId}
					isOpen={modalIsOpen}
					onModalClose={this._onModalClose}
					tmplModel={modalTmplModel}
					originalTemplate={modalTmplOrig}
					onModelChange={this._onModelChange}
				/>
			</div>
		);
	}

	// method will be called after some converted model is changed
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
		const { isLoading, index, maxTmpls, selectedConverterId } = this.state;
		const { tmplsToFetch } = this.props;

		// if loading is in progress or we loaded all templates from server
		if (isLoading || index === maxTmpls) {
			return;
		}

		this.setState({
			// show that new templates download is in progress
			isLoading: true
		});
		// fetch new templates from server
		convertTemplates(selectedConverterId, index, tmplsToFetch)
			.then(convTmpl => {
				this.setState(prevState => {
					const {
						originalTemplates,
						convertedTemplates
					} = prevState.templates;

					// update state with newly fetched template models
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
			// clear prevoust calculation for visible elements
			clearTimeout(this._newVisibleElTimeout);

			// set timeout if user is scrolling too fast through templates to
			// prevent unnecessary render and highlight of templates, insted show
			// only place holder and loading message for templates
			this._newVisibleElTimeout = setTimeout(() => {
				this.setState({
					visibleElements: this._offsetHeights
						.filter(rect => {
							return this._isElementInViewport(rect, 1200);
						})
						.map(rect => this._offsetHeights.indexOf(rect))
				});
			}, 200);
		}
	}

	_isElementInViewport(rect, extendBounds = 0) {
		const { pageYOffset, innerHeight } = window;
		const pageTop = Math.max(pageYOffset - extendBounds, 0);
		const pageBottom = pageYOffset + innerHeight + extendBounds;
		const elementTop = rect.top;
		const elementBottom = elementTop + rect.height;

		return elementTop <= pageBottom && elementBottom >= pageTop;
	}

	_onCoverterChange(e) {
		this.setState({
			selectedConverterId: e.currentTarget.value,
			index: 0
		});
	}

	_openModal(tmplModel, originalTemplate) {
		this.setState({
			modalIsOpen: true,
			modalTmplModel: tmplModel,
			modalTmplOrig: originalTemplate
		});
	}

	_onModalClose() {
		this.setState({
			modalIsOpen: false,
			modalTmplModel: null,
			modalTmplOrig: null
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

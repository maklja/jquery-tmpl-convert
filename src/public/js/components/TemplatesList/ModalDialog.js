import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { convertTemplate, updateTemplate } from 'app-js/requests';

import './template_modal.css';

class ModalDialog extends React.Component {
	constructor(props) {
		super(props);

		const { isOpen, tmplModel, originalTemplate, converterId } = props;

		this.state = {
			isOpen: isOpen,
			tmplModel: tmplModel,
			originalTemplate: originalTemplate,
			htmlText: tmplModel ? tmplModel.html : '',
			converterId
		};

		this._closeModal = this._closeModal.bind(this);
		this._onHTMLChange = this._onHTMLChange.bind(this);
		this._onResetClick = this._onResetClick.bind(this);
		this._onSaveClick = this._onSaveClick.bind(this);
		this._onCopy = this._onCopy.bind(this);

		this.taTmpl = React.createRef();

		Modal.setAppElement(document.getElementById('modal-container'));
	}

	static getDerivedStateFromProps(newProps, state) {
		const { isOpen, tmplModel, originalTemplate, converterId } = newProps;

		if (tmplModel !== state.tmplModel) {
			return {
				isOpen: isOpen,
				tmplModel: tmplModel,
				originalTemplate: originalTemplate,
				htmlText: tmplModel ? tmplModel.html : '',
				converterId
			};
		}

		return null;
	}

	render() {
		const { isOpen, tmplModel, htmlText, error } = this.state;
		const disabled = tmplModel ? htmlText === tmplModel.html : true;

		if (isOpen) {
			// if modal document is opened hide scroolbars on body element
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return tmplModel ? (
			<Modal
				isOpen={isOpen}
				contentLabel={tmplModel.path}
				className="template-modal"
			>
				<div className="template-header">
					<div className="template-name" title={tmplModel.path}>
						{tmplModel.path.split('/').pop()}
					</div>
					<div className="close-button" onClick={this._closeModal}>
						<span>&#10006;</span>
					</div>
				</div>
				<div className="template-body">
					<form>
						<div className="button-controls">
							<button
								onClick={this._onSaveClick}
								disabled={disabled}
							>
								Save
							</button>
							<button onClick={this._onResetClick}>Reset</button>
							<button onClick={this._onCopy}>
								Copy to clipboard
							</button>
						</div>
						<textarea
							ref={this.taTmpl}
							className="textarea-markup"
							value={htmlText}
							onChange={this._onHTMLChange}
						/>
						{error ? (
							<div className="error-msg">
								<span>Error message: </span>
								<span className="text">{error}</span>
							</div>
						) : (
							''
						)}
					</form>
				</div>
			</Modal>
		) : (
			''
		);
	}

	_onHTMLChange(e) {
		this.setState({
			htmlText: e.currentTarget.value
		});
	}

	_onCopy(e) {
		e.preventDefault();

		this.taTmpl.current.select();

		document.execCommand('copy');
	}

	_onResetClick(e) {
		e.preventDefault();

		const { originalTemplate, converterId } = this.state;
		const { onModelChange } = this.props;

		convertTemplate(converterId, originalTemplate.guid)
			.then(newTmplModel => {
				this.setState({
					tmplModel: newTmplModel,
					htmlText: newTmplModel.html,
					error: null
				});
				onModelChange(newTmplModel);
			})
			.catch(errObj => {
				this.setState({
					error: errObj.err
				});
			});
	}

	_onSaveClick(e) {
		e.preventDefault();

		const { tmplModel, htmlText, converterId } = this.state;
		const { onModelChange } = this.props;

		updateTemplate(converterId, tmplModel.guid, htmlText)
			.then(newTmplModel => {
				this.setState({
					tmplModel: newTmplModel,
					htmlText: newTmplModel.html,
					error: null
				});
				onModelChange(newTmplModel);
			})
			.catch(errObj => {
				this.setState({
					error: errObj.err
				});
			});
	}

	_closeModal() {
		const { onModalClose } = this.props;

		this.setState(
			{
				isOpen: false,
				tmplModel: null,
				originalTemplate: null
			},
			() => onModalClose()
		);
	}
}

ModalDialog.propTypes = {
	isOpen: PropTypes.bool,
	tmplModel: PropTypes.object,
	originalTemplate: PropTypes.object,
	converterId: PropTypes.string.isRequired,
	onModelChange: PropTypes.func,
	onModalClose: PropTypes.func
};

ModalDialog.defaultProps = {
	isOpen: false,
	onModelChange: () => {},
	onModalClose: () => {}
};

export default ModalDialog;

import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './template_modal.css';

class ModalDialog extends React.Component {
	constructor(props) {
		super(props);

		const { isOpen, tmplModel, converterId } = props;

		this.state = {
			isOpen: isOpen,
			tmplModel: tmplModel,
			htmlText: tmplModel ? tmplModel.html : '',
			converterId
		};

		this._closeModal = this._closeModal.bind(this);
		this._onHTMLChange = this._onHTMLChange.bind(this);
		this._onRefreshClick = this._onRefreshClick.bind(this);
		this._onSaveClick = this._onSaveClick.bind(this);

		Modal.setAppElement(document.getElementById('modal-container'));
	}

	componentWillReceiveProps(newProps) {
		const { isOpen, tmplModel, converterId } = newProps;

		this.setState({
			isOpen: isOpen,
			tmplModel: tmplModel,
			htmlText: tmplModel ? tmplModel.html : '',
			converterId
		});
	}

	render() {
		const { isOpen, tmplModel, htmlText, error } = this.state;
		const disabled = tmplModel ? htmlText === tmplModel.html : true;

		if (isOpen) {
			// if modal document is opened hide scroolbars on body element
			document.body.style.overflow = 'hidden';
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
							<button onClick={this._onRefreshClick}>
								Refresh
							</button>
						</div>
						<textarea
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

	_onRefreshClick(e) {
		e.preventDefault();

		this.setState(state => {
			return Object.assign({}, state, {
				htmlText: state.tmplModel ? state.tmplModel.html : '',
				error: null
			});
		});
	}

	_onSaveClick(e) {
		e.preventDefault();

		const url = `/updateTemplate`;
		const { tmplModel, htmlText, converterId } = this.state;
		const { onModelChange } = this.props;

		window
			.fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					templateUpdate: {
						converterId,
						id: tmplModel.id,
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
				this.setState({
					tmplModel: newTmplModel,
					htmlText: newTmplModel.html,
					error: null
				});
				onModelChange(newTmplModel);
			})
			.catch(errResp => {
				errResp.json().then(errObj =>
					this.setState({
						error: errObj.err
					})
				);
			});
	}

	_closeModal() {
		const { onModalClose } = this.props;

		document.body.style.overflow = null;
		this.setState(
			{
				isOpen: false,
				tmplModel: null
			},
			() => onModalClose()
		);
	}
}

ModalDialog.propTypes = {
	isOpen: PropTypes.bool,
	tmplModel: PropTypes.object,
	converterId: PropTypes.string.isRequired,
	onModelChange: PropTypes.func,
	onModalClose: PropTypes.func
};

ModalDialog.defaultProps = {
	isOpen: false,
	tmplModel: {},
	onModelChange: () => {},
	onModalClose: () => {}
};

export default ModalDialog;

import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './template_modal.css';

class ModalDialog extends React.Component {
	constructor(props) {
		super(props);

		const { isOpen, tmplModel } = props;

		this.state = {
			isOpen: isOpen,
			tmplModel: tmplModel,
			htmlText: tmplModel ? tmplModel.html : ''
		};

		this._closeModal = this._closeModal.bind(this);
		this._onHTMLChange = this._onHTMLChange.bind(this);

		Modal.setAppElement(document.getElementById('modal-container'));
	}

	componentWillReceiveProps(newProps) {
		const { isOpen, tmplModel } = newProps;

		this.setState({
			isOpen: isOpen,
			tmplModel: tmplModel,
			htmlText: tmplModel ? tmplModel.html : ''
		});
	}

	render() {
		const { isOpen, tmplModel, htmlText, error } = this.state;

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
						<div className="button-controls" />
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

	_closeModal() {
		const { onModalClose } = this.props;
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

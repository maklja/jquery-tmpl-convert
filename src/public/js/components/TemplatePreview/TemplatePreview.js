import React from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';

import './template_preview.css';

export class TemplatePreview extends React.Component {
	constructor(props) {
		super(props);

		this.templateCode = React.createRef();
	}

	componentDidMount() {
		// expensive operation do it async
		this._colorTimeout = setTimeout(
			() => Prism.highlightElement(this.templateCode.current),
			0
		);
	}

	componentWillUnmount() {
		window.clearTimeout(this._colorTimeout);
	}

	shouldComponentUpdate(nextProps) {
		// only update component if html is changed
		// in order to optimize performance
		return this.props.template.html !== nextProps.template.html;
	}

	componentDidUpdate() {
		// ugly way to remove line highlight from element that is added by
		// prisim highlight library, because it doesn't contain API for removing
		// line highlights
		const parentNode = this.templateCode.current.parentNode;
		// convert HTML collection to array
		for (let curChildNode of Array.from(parentNode.children)) {
			if (curChildNode.classList.contains('line-highlight')) {
				parentNode.removeChild(curChildNode);
			}
		}

		Prism.highlightElement(this.templateCode.current);
	}

	render() {
		const { template, originalTemplate, onOpenModal } = this.props,
			linesWithError = template.errors
				.map(curErr => curErr.lineNumber.join(','))
				.join(',');

		return (
			<div className="template-preview">
				<div className="template-body">
					<pre
						onDoubleClick={() =>
							onOpenModal(template, originalTemplate)
						}
						data-line={linesWithError}
						className="line-numbers language-html"
					>
						<code ref={this.templateCode} className="language-html">
							{template.html}
						</code>
					</pre>
				</div>
				{template.errors.length > 0 ? (
					<div className="template-errors">
						<div className="title">Parser messages</div>
						{template.errors.map((curError, i) => (
							<div
								key={i}
								className={`error-block ${curError.type}`}
							>
								<div className="code">{curError.code}</div>
								<div className="message">
									{curError.message}
								</div>
								<div className="line-number">
									{curError.lineNumber}
								</div>
							</div>
						))}
					</div>
				) : (
					''
				)}

				<div className="file-path">{template.path}</div>
			</div>
		);
	}
}

TemplatePreview.propTypes = {
	template: PropTypes.object.isRequired,
	originalTemplate: PropTypes.object,
	onOpenModal: PropTypes.func
};

TemplatePreview.defaultProps = {
	onOpenModal: () => {}
};

export const TemplatePreviewLoading = ({ height }) => {
	return (
		<div
			className="templates"
			style={{
				height: height
			}}
		>
			<div className="templates-item-loading">Loading</div>
		</div>
	);
};

TemplatePreviewLoading.propTypes = {
	height: PropTypes.number.isRequired
};

import React from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';

import './template_preview.css';

class TemplatePreview extends React.Component {
	constructor(props) {
		super(props);

		this.templateCode = React.createRef();
	}

	componentDidMount() {
		Prism.highlightElement(this.templateCode.current);
	}

	componentDidUpdate() {
		Prism.highlightElement(this.templateCode.current);
	}

	render() {
		const { template, onOpenModal } = this.props,
			linesWithError = template.errors
				.map(curErr => curErr.lineNumber.join(','))
				.join(',');

		return (
			<div className="template-preview">
				<div className="template-body">
					<pre
						onClick={() => onOpenModal(template)}
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
	onOpenModal: PropTypes.func
};

TemplatePreview.defaultProps = {
	onOpenModal: () => {}
};

export default TemplatePreview;

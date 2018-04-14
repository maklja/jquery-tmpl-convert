import React from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';

import './template_preview.css';

const TemplatePreview = ({ template }) => {
	return (
		<div className="template-preview">
			<div className="template-body">
				<pre>
					<code
						className="language-html"
						dangerouslySetInnerHTML={{
							__html: Prism.highlight(
								template.html,
								Prism.languages.html,
								'html'
							)
						}}
					/>
				</pre>
			</div>
			<div className="file-path">{template.path}</div>
		</div>
	);
};

TemplatePreview.propTypes = {
	template: PropTypes.object.isRequired
};

export default TemplatePreview;

import React from 'react';
import PropTypes from 'prop-types';
import TemplatePreview from 'app-js/components/TemplatePreview';
import './template_list_preview.css';

const TemplatesList = ({ templates }) => {
	const originalTemplates = templates.originalTemplates.map(curTemplate => (
			<TemplatePreview
				key={`${curTemplate.path}_${curTemplate.id}`}
				template={curTemplate}
			/>
		)),
		convertedTemplates = templates.convertedTemplates.map(curTemplate => (
			<TemplatePreview
				key={`${curTemplate.path}_${curTemplate.id}`}
				template={curTemplate}
			/>
		));

	return (
		<div>
			{originalTemplates.map((curTmpl, i) => (
				<div key={i} className="templates-preview">
					<div className="templates-preview-container">{curTmpl}</div>
					<div className="templates-preview-container">
						{convertedTemplates[i]}
					</div>
				</div>
			))}
		</div>
	);
};

TemplatesList.propTypes = {
	templates: PropTypes.object
};

TemplatesList.defaultProps = {
	templates: {
		originalTemplates: null,
		convertedTemplates: null
	}
};

export default TemplatesList;

import React from 'react';
import PropTypes from 'prop-types';
import TemplatePreview from 'app-js/components/TemplatePreview';

const TemplatesList = ({ templates }) => {
	return (
		<div>
			{templates.map(curTemplate => (
				<TemplatePreview key={curTemplate.id} template={curTemplate} />
			))}
		</div>
	);
};

TemplatesList.propTypes = {
	templates: PropTypes.arrayOf(PropTypes.object)
};

TemplatesList.defaultProps = {
	templates: []
};

export default TemplatesList;

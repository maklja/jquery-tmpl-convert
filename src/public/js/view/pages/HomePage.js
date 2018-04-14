import React from 'react';
import PropTypes from 'prop-types';
import TemplatesList from 'app-js/components/TemplatesList';

const HomePage = ({ templates }) => {
	return <TemplatesList templates={templates} />;
};

export default HomePage;

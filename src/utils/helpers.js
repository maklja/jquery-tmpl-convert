const cheerio = require('cheerio');
const Unknown = require('../model/Unknown');
const Statement = require('../model/Statement');
const Expression = require('../model/Expression');

const isExpression = token => token instanceof Expression;
const isStatement = token => token instanceof Statement;
const isUnknown = token => token instanceof Unknown;

const extractTemplateHTML = templateData => {
	// parse template html
	let $ = cheerio.load(templateData),
		// one html file can contain multiple template script tags
		// so extract them all
		templates = $('script');

	// create template model for each template
	return templates.toArray().map(curTemplate => {
		let templateId = curTemplate.attribs['id'],
			type = curTemplate.attribs['type'];

		if (templateId == null) {
			throw new Error('Template id is missing.');
		}

		if (type == null) {
			throw new Error('Template type is missing.');
		}

		const $node = cheerio.load(curTemplate),
			outerHTML = $node.html().trim(),
			innerHTML = curTemplate.children.reduce(
				(childrenValues, curChild) =>
					(childrenValues += curChild.nodeValue),
				''
			);

		return {
			templateId,
			type,
			// get text inside script tag
			innerHTML,
			outerHTML
		};
	});
};

const getTemplateName = tmplPath => {
	// replace path backslash with forward slash
	// and take last part that is name of the template
	return tmplPath
		.replace('\\', '/')
		.split('/')
		.pop();
};

module.exports = {
	isExpression,
	isStatement,
	isUnknown,
	extractTemplateHTML,
	getTemplateName
};

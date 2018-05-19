const ValidationError = require('../../model/ValidationError');
const TemplateModel = require('../../model/TemplateModel');
const NodeTreeMaker = require('../../nodes/NodeTreeMaker');
const { CONVERT_ERROR } = require('../../model/error_code');
const IfConverter = require('./IfConverter');
const ElseConverter = require('./ElseConverter');
const HTMLConverter = require('./HTMLConverter');
const EachConverter = require('./EachConverter');
const TmplConverter = require('./TmplConverter');
const UnknownConverter = require('./UnknownConverter');
const ExpressionConverter = require('./ExpressionConverter');
const {
	isExpression,
	isStatement,
	isUnknown,
	getTemplateName
} = require('../../utils/helpers');
const { HTML } = require('../../tokens/tokens');

class HandlebarsConverter {
	get convertTemplates() {
		return this._convertTemplates;
	}

	constructor(cfg) {
		this._outputDir = cfg.outputDir;
		this._resetState();
		this.SCRIPT_TYPE = 'text/x-handlebars-template';

		// register converter for statement
		this.converters = [
			new IfConverter(),
			new ElseConverter(),
			new HTMLConverter(),
			new EachConverter(),
			new TmplConverter(),
			new UnknownConverter(),
			new ExpressionConverter()
		];
	}

	convert(templates) {
		this._resetState();

		// convert each template
		for (let curTemplateModel of templates) {
			// tokens state for each template
			this._convertTokens = [];
			this._convertErrors = [];
			this._context = {
				replaceExpression: {
					// every $item, replace with this
					$item: 'this'
				}
			};

			// convert jQuery template to handlebars template
			this._convertTemplates.push(
				this._convertTemplate(curTemplateModel)
			);
		}

		return this._convertTemplates;
	}

	_convertTemplate(tmplModel) {
		// check if template has parse errors
		if (tmplModel.errors.length > 0) {
			this._convertErrors.push(
				new ValidationError(
					null,
					CONVERT_ERROR.code,
					CONVERT_ERROR.message(
						`Template ${tmplModel.id} has parsing errors.`
					)
				)
			);
		} else {
			for (let curNode of tmplModel.tokenNodes) {
				this._convertNode(curNode);
			}
		}

		const convTmplPath = `${this._outputDir}/${getTemplateName(
			tmplModel.path
		)}`;

		// after template is converted, create new template model for handlebars
		let convertedTemplateModel = new TemplateModel(
			tmplModel.id,
			this.SCRIPT_TYPE,
			// set template output file
			convTmplPath,
			// try to beautify html output
			this._hbsTemplateValue(this._convertTokens),
			this._addScriptTag(
				tmplModel.id,
				this._hbsTemplateValue(this._convertTokens)
			)
		);

		// get all convert errors
		convertedTemplateModel.errors = this._convertErrors;

		// convert tokens to nodes
		let nodeTreeMaker = new NodeTreeMaker(this._convertTokens);
		convertedTemplateModel.tokenNodes = nodeTreeMaker.createTree();

		return convertedTemplateModel;
	}

	_addScriptTag(id, tmpl) {
		return `<script id="${id}" type="${this.SCRIPT_TYPE}">${tmpl}</script>`;
	}

	_convertNode(node) {
		if (!node.isExpression() && !node.isStatement() && !node.isUnknown()) {
			throw new Error('Unknown node type.');
		}

		// find converter for node
		let converter = this.converters.find(curConverter =>
				curConverter.canConvert(node)
			),
			converterdToken = null;

		// if converter is found
		if (converter) {
			let errors = [];
			// convert node
			converterdToken = converter.convert(node, this._context, errors);
			this._convertTokens.push(converterdToken);
			this._convertErrors = this._convertErrors.concat(errors);
		}

		// convert all node children
		for (let curChildNode of node.children) {
			this._convertNode(curChildNode);
		}

		// convert all node siblings
		for (let curSiblingNode of node.siblings) {
			this._convertNode(curSiblingNode);
		}

		if (converter) {
			// at the end add closing token, if exists
			let closingToken = converter.getClosingToken(node, converterdToken);
			if (closingToken != null) {
				this._convertTokens.push(closingToken);
			}

			converter.convertComplited(node, this._context);
		}
	}

	_resetState() {
		this._convertTokens = null;
		this._convertTemplates = [];
	}

	_hbsTokenValue(token) {
		if (isStatement(token)) {
			let closing = token.isClosing ? '/' : '',
				expression = token.expression
					? ` ${token.expression.value}`
					: '',
				value = `${closing}${token.value}${expression}`;

			return token.name === HTML ? `{{{${value}}}}` : `{{${value}}}`;
		} else if (isExpression(token)) {
			return `{{${token.value}}}`;
		} else if (isUnknown(token)) {
			return token.value;
		} else {
			throw new Error(`Unknown token type ${token.treeType}`);
		}
	}

	_hbsTemplateValue(tokens) {
		let value = '';
		for (let curToken of tokens) {
			value += this._hbsTokenValue(curToken);
		}

		return value;
	}
}

module.exports = HandlebarsConverter;

const TemplateParser = require('../../parser/TemplateParser');
const ValidationError = require('../../model/ValidationError');
const TemplateModel = require('../../model/TemplateModel');
const NodeTreeMaker = require('../../nodes/NodeTreeMaker');
const { CONVERT_ERROR } = require('../../model/error_code');
const { extractTokenText } = require('../../parser/parserUtils');
const IfConverter = require('./IfConverter');
const ElseConverter = require('./ElseConverter');
const HTMLConverter = require('./HTMLConverter');
const EachConverter = require('./EachConverter');
const TmplConverter = require('./TmplConverter');
const { hbsTemplateValue } = require('../../utils/helpers');
const htmlBeautify = require('html-beautify');

class HandlebarsConverter {
	get convertTemplates() {
		return this._convertTemplates;
	}

	constructor() {
		this._resetState();
		this.SCRIPT_TYPE = 'text/x-handlebars-template';

		// register converter for statement
		this.converters = [
			new IfConverter(this),
			new ElseConverter(this),
			new HTMLConverter(this),
			new EachConverter(this),
			new TmplConverter(this)
		];
	}

	convert(paths) {
		this._resetState();

		return new Promise((fulfill, reject) => {
			// let jquery template parse all file from paths and create template models
			let templateParser = new TemplateParser(paths);
			// parse all templates
			templateParser
				.parse()
				.then(() => {
					// convert each template
					for (let curTemplateModel of templateParser.templates) {
						// tokens state for each template
						this._convertTokens = [];
						this._convertErrors = [];
						this._context = {
							replaceExpression: {}
						};

						// convert current template
						this._convertTemplate(curTemplateModel);

						// after template is converted, create new template model for handlebars
						let convertedTemplateModel = new TemplateModel(
							curTemplateModel.id,
							this.SCRIPT_TYPE,
							curTemplateModel.path,
							// try to beautify html output
							htmlBeautify(hbsTemplateValue(this._convertTokens))
						);

						// get all convert errors
						convertedTemplateModel.errors = this._convertErrors;

						// convert tokens to nodes
						let nodeTreeMaker = new NodeTreeMaker(
							this._convertTokens
						);
						convertedTemplateModel.tokenNodes = nodeTreeMaker.createTree();

						this._convertTemplates.push(convertedTemplateModel);
					}

					fulfill();
				})
				.catch(e => {
					reject(e);
				});
		});
	}

	_convertTemplate(templateModel) {
		if (templateModel.errors.length > 0) {
			this._convertErrors.push(
				new ValidationError(
					null,
					CONVERT_ERROR.code,
					CONVERT_ERROR.message(
						`Template ${templateModel.id} has parsing errors.`
					)
				)
			);
		} else {
			for (let curNode of templateModel.tokenNodes) {
				this._convertNode(curNode);
			}
		}
	}

	_convertNode(node) {
		if (node.isExpression()) {
			this._convertTokens.push(this._convertExpression(node));
		} else if (node.isStatement()) {
			this._covertStatement(node);
		} else if (node.isUnknown()) {
			this._convertTokens.push(node.token.clone());
		} else {
			throw new Error('Unknown node type.');
		}
	}

	_convertExpression(node) {
		return this.convertExpressionToken(node.token);
	}

	convertExpressionToken(token) {
		let expression = token.clone();
		expression.value = extractTokenText(token.tree, {
			// we need to replace $item, $index, $value properties with
			// handlebars one
			replace: this._context.replaceExpression
		});

		if (!token.isIdentifier() && !token.isMemberExpression()) {
			this._convertErrors.push(
				new ValidationError(
					expression,
					CONVERT_ERROR.code,
					CONVERT_ERROR.message(
						`Expression can't be type of ${token.treeType}.`
					)
				)
			);
		}

		return expression;
	}

	_covertStatement(node) {
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
		this._context = {
			replaceExpression: {}
		};
	}
}

module.exports = HandlebarsConverter;

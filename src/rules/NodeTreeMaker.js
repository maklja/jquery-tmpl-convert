const { rules } = require('./rules');
const ValidationError = require('../model/ValidationError');
const {
	STATMENT_MISSING,
	UNEXPECTED_STATMENT,
	MISSING_CLOSING_TOKEN,
	MISSING_STARTING_TOKEN
} = require('./error_code');

class Node {
	get children() {
		return this._children;
	}

	get siblings() {
		return this._siblings;
	}

	get token() {
		return this._token;
	}

	get closingToken() {
		return this._closingToken;
	}
	set closingToken(closingToken) {
		this._closingToken = closingToken;
	}

	constructor(token) {
		this._children = [];
		this._token = token;
		this._siblings = [];
	}
}

module.exports = class NodeTreeMaker {
	constructor(tokens) {
		this._tokens = tokens;
		this._rules = rules;
		this._closeTokenMissing = [];
		this._nodes = [];
		this._validationErrors = [];
	}

	createTree() {
		for (let curToken of this._tokens) {
			let rule = this._findRule(curToken) || {},
				node = new Node(curToken);

			this._insertTokenToNodeTree(this._nodes, node, rule);

			if (rule.closeToken != null) {
				this._closeTokenMissing.push(node);
			}
		}
		// for (let curToken of this._tokens) {
		// 	let rule = this._findRule(curToken);
		// 	if (rule != null) {
		// 		let errors = this._validateToken(curToken, rule);
		// 		if (errors.length > 0) {
		// 			validationErrors = validationErrors.concat(errors);
		// 		}
		// 	}
		// }
		//
		// if (this._closeTokenMissing.length > 0) {
		// 	let missingClosingToken = this._closeTokenMissing.pop();
		// 	validationErrors.push(
		// 		new ValidationError(
		// 			missingClosingToken,
		// 			MISSING_CLOSING_TOKEN.message(missingClosingToken),
		// 			MISSING_CLOSING_TOKEN.code
		// 		)
		// 	);
		// }

		return this._nodes;
	}

	_validateToken(token, rule) {
		let validationErrors = [];
		if (rule.statementMandatory && !token.statement) {
			validationErrors.push(
				new ValidationError(
					token,
					STATMENT_MISSING.message(token),
					STATMENT_MISSING.code
				)
			);
		} else if (rule.canHaveStatement === false && token.statement) {
			validationErrors.push(
				new ValidationError(
					token,
					UNEXPECTED_STATMENT.message(token),
					UNEXPECTED_STATMENT.code
				)
			);
		}

		// if token has closing tag
		if (rule.closeToken != null) {
			this._closeTokenMissing.push(token);
		} else if (rule.isClosingTag) {
			let validationError = this._checkCloseToken(token);
			if (validationError != null) {
				validationErrors.push(validationError);
			}
		}

		return validationErrors;
	}

	_checkCloseToken(token) {
		if (this._closeTokenMissing.length === 0) {
			return new ValidationError(
				token,
				MISSING_STARTING_TOKEN.message(token),
				MISSING_STARTING_TOKEN.code
			);
		}

		let lastToken = this._closeTokenMissing[
				this._closeTokenMissing.length - 1
			],
			rule = this._findRule(lastToken);

		if (rule.closeToken === token.name) {
			this._closeTokenMissing.pop();
			return null;
		} else {
			return new ValidationError(
				token,
				MISSING_STARTING_TOKEN.message(token),
				MISSING_STARTING_TOKEN.code
			);
		}
	}

	_insertTokenToNodeTree(nodes, node, rule) {
		let lastNodeOnStack = this._closeTokenMissing[
			this._closeTokenMissing.length - 1
		];

		// if there is unclosed node on stack
		// then all nodes after him are either
		// children nodes or closing node
		if (lastNodeOnStack != null) {
			let lastTokenRule = this._findRule(lastNodeOnStack.token);
			// if this is closing token
			if (
				this._closeNode(lastNodeOnStack, lastTokenRule, node) === false
			) {
				if (
					this._addSiblingNode(lastNodeOnStack, node, rule) === false
				) {
					lastNodeOnStack.children.push(node);
				}
			}
		} else {
			// root nodes
			nodes.push(node);
		}
	}

	_closeNode(nodeToClose, nodeToCloseRule, closingNode) {
		// if closing token match open token
		if (nodeToCloseRule.closeToken.name === closingNode.token.name) {
			// close the token
			nodeToClose.closingToken = closingNode.token;
			// remove it from the stack of open nodes
			this._closeTokenMissing.pop();

			return true;
		}

		return false;
	}

	_addSiblingNode(sliblingNode, node, rule) {
		if (rule.afterTokens != null) {
			const afterTokenExists =
				rule.afterTokens.find(
					token => token.name === sliblingNode.token.name
				) != null;
			if (afterTokenExists) {
				sliblingNode.siblings.push(node);

				return true;
			} else {
				// TODO error
			}
		}

		return false;
	}

	_findRule(token) {
		for (let curRule of this._rules) {
			let tokenRule = curRule.ruleFor.find(curToken => {
				return curToken.name === token.name;
			});

			if (tokenRule != null) {
				return curRule;
			}
		}

		return null;
	}
};

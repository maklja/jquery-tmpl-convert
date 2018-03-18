const { findRule } = require('../utils/rules.js');

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
		this._closeTokenMissing = [];
		this._nodes = [];
	}

	createTree() {
		for (let curToken of this._tokens) {
			let rule = findRule(curToken) || {},
				node = new Node(curToken);

			this._insertTokenToNodeTree(this._nodes, node, rule);

			if (rule.closeToken != null) {
				this._closeTokenMissing.push(node);
			}
		}

		return this._nodes;
	}

	_insertTokenToNodeTree(nodes, node, rule) {
		let lastNodeOnStack = this._closeTokenMissing[
			this._closeTokenMissing.length - 1
		];

		// if there is unclosed node on stack
		// then all nodes after him are either
		// children nodes or closing node
		if (lastNodeOnStack != null) {
			let lastTokenRule = findRule(lastNodeOnStack.token);
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
};

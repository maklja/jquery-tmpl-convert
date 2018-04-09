const Node = require('../model/Node');

module.exports = class NodeTreeMaker {
	constructor(tokens) {
		this._tokens = tokens;
		this._closeTokenMissing = [];
		this._lastSibling = null;
		this._nodes = [];
	}

	createTree() {
		for (let curToken of this._tokens) {
			let rule = curToken.pattern || {},
				node = new Node(curToken);

			this._insertTokenToNodeTree(this._nodes, node, rule);

			if (rule.hasClosing === true) {
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
			// if this is closing token
			if (this._closeNode(lastNodeOnStack, node) === false) {
				if (this._addSiblingNode(lastNodeOnStack, node, rule)) {
					this._lastSibling = node;
				} else {
					if (this._lastSibling == null) {
						lastNodeOnStack.children.push(node);
					} else {
						this._lastSibling.children.push(node);
					}
				}
			}
		} else {
			// root nodes
			nodes.push(node);
		}
	}

	_closeNode(nodeToClose, closingNode) {
		// if closing token match open token
		if (
			closingNode.token.isClosing &&
			nodeToClose.token.name === closingNode.token.name
		) {
			// close the token
			nodeToClose.closingToken = closingNode.token;
			// remove it from the stack of open nodes
			this._closeTokenMissing.pop();
			// close sibling node after
			this._lastSibling = null;

			return true;
		}

		return false;
	}

	_addSiblingNode(sliblingNode, node, rule) {
		if (rule.afterTokens != null) {
			const afterTokenExists =
				rule.afterTokens.find(
					token => token === sliblingNode.token.name
				) != null;
			if (afterTokenExists) {
				sliblingNode.siblings.push(node);

				return true;
			}
		}

		return false;
	}
};

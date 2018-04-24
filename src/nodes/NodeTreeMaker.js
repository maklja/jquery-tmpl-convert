const Node = require('../model/Node');

module.exports = class NodeTreeMaker {
	constructor(tokens) {
		this._tokens = tokens;
	}

	createTree() {
		let nextToken = null,
			results = [],
			iter = this._makeIterator(this._tokens);

		while ((nextToken = iter.next()).done === false) {
			results.push(this._createNode(nextToken.value, null, iter));
		}

		return results;
	}

	// if unknown else unknown /if
	_createNode(token, parentNode, iter) {
		let node = new Node(token),
			rule = token.pattern || {},
			haveClosing = rule.hasClosing === true,
			isSibling = this._isSiblingNode(node, parentNode, rule),
			haveChildren = haveClosing || isSibling;

		if (token.isClosing) {
			return node;
		}

		if (parentNode != null) {
			if (isSibling) {
				parentNode.siblings.push(node);
			} else {
				parentNode.children.push(node);
			}
		}

		// process all children tokens
		if (haveChildren) {
			let nextNode = null,
				next = null;

			while ((next = iter.next()).done === false) {
				// go to the next token until we reach end token
				nextNode = this._createNode(next.value, node, iter);

				// reach end token
				if (nextNode.token.isClosing) {
					break;
				}
			}

			// if current node have closing token
			// close it
			if (haveClosing) {
				// opening node name must match closing node name
				if (node.token.name !== nextNode.token.name) {
					throw new Error(
						`Unexpected closing token with name ${
							nextNode.token.name
						} !== ${node.token.name}`
					);
				}
				node.closingToken = nextNode.token;
			} else {
				// in case of sibling node just return closing node
				return nextNode;
			}
		}

		// return root node at the end
		return node;
	}

	_isSiblingNode(node, sliblingNode, rule) {
		if (rule.afterTokens != null) {
			const afterTokenExists =
				rule.afterTokens.find(
					token => token === sliblingNode.token.name
				) != null;
			if (afterTokenExists) {
				return true;
			}
		}

		return false;
	}

	_makeIterator(array) {
		var nextIndex = 0;

		return {
			next() {
				return nextIndex < array.length
					? { value: array[nextIndex++], done: false }
					: { done: true };
			}
		};
	}
};

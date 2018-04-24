const newLinesRegex = /(\r\n\t|\n|\r\t)/gm;
const tabRegex = /\t+/g;
const findAllTokensRegex = /({{([\s\S]+?)}})|(\${(.+?)})/g;
// eslint-disable-next-line
const findAllExpressionsRegex = '(\\${(.+?)})|({{=(.+?)}})';
const findAllStatementsRegex = '({{([\\s\\S]+?)}})';

const isCompound = tokenTree => tokenTree.type === 'Compound';
const isIdentifier = tokenTree => tokenTree.type === 'Identifier';
const isBinaryExpression = tokenTree => tokenTree.type === 'BinaryExpression';
const isLiteral = tokenTree => tokenTree.type === 'Literal';
const isMemberExpression = tokenTree => tokenTree.type === 'MemberExpression';
const isCallExpression = tokenTree => tokenTree.type === 'CallExpression';
const isUnaryExpression = tokenTree => tokenTree.type === 'UnaryExpression';
const isLogicalExpression = tokenTree => tokenTree.type === 'LogicalExpression';

const replaceTokenName = (tokenName, replaceObj = {}) =>
	replaceObj[tokenName] != null ? replaceObj[tokenName] : tokenName;

// function uses recursion to construct full token name from tree
// options are used to replace name of the tree node with target name
const extractTokenText = (tree, options = {}) => {
	if (isIdentifier(tree)) {
		// identifier node have name that can be replace with other name
		return replaceTokenName(tree.name, options.replace);
	} else if (isLiteral(tree)) {
		// literal is constant so we can't change it, just return raw value
		return tree.raw;
	} else if (isMemberExpression(tree)) {
		return `${extractTokenText(tree.object, options)}.${extractTokenText(
			tree.property,
			options
		)}`;
	} else if (isCallExpression(tree)) {
		let argumentsText = tree.arguments
			.map(curParam => extractTokenText(curParam, options))
			.join(',');
		return `${extractTokenText(tree.callee, options)}(${argumentsText})`;
	} else if (isBinaryExpression(tree)) {
		return `${extractTokenText(tree.left, options)} ${
			tree.operator
		} ${extractTokenText(tree.right, options)}`;
	} else if (isUnaryExpression(tree)) {
		let statement = tree.prefix
			? `${tree.operator}${extractTokenText(tree.argument, options)}`
			: `${extractTokenText(tree.argument, options)}${tree.operator}`;

		return statement;
	} else if (isLogicalExpression(tree)) {
		return `${extractTokenText(tree.left, options)} ${
			tree.operator
		} ${extractTokenText(tree.right, options)}`;
	} else {
		throw new Error(`Unsupported token type ${tree.type}`);
	}
};

const isClosingToken = tokenTree =>
	isBinaryExpression(tokenTree) &&
	tokenTree.operator === '/' &&
	tokenTree.left === false &&
	isIdentifier(tokenTree.right);

const getLineNumber = (text, tokenValue, fromIndex = 0, offset = 0) => {
	if (text == null || tokenValue == null) {
		return -1;
	}

	const findNewlinesRegex = /\r\n|\r|\n/;
	const NEW_LINE_WIN = '\n';
	const NEW_LINE_MAC = '\r';
	for (let i = fromIndex; i < text.length; i++) {
		// get current character from test string and
		// if current character is new line just skip it and go to the next one
		if (text[i] === NEW_LINE_WIN || text[i] === NEW_LINE_MAC) {
			continue;
		}

		let found = true,
			// number of new lines inside token
			k = 0;
		// try to find tokenValue from current index
		for (let j = 0; j < tokenValue.length; j++) {
			// get current text character
			let textChar = text[i + j + k];
			// escape all new lines inside token value
			while (textChar === NEW_LINE_WIN || text[i] === NEW_LINE_MAC) {
				textChar = text[i + j + ++k];
			}

			// if at least one character doesn't match search fails
			if (tokenValue[j] !== textChar) {
				found = false;
				break;
			}
		}

		// if we found token value inside text
		if (found) {
			// first get new lines number before first character of token value
			let numLinesBeforeToken = text
					.substring(0, i)
					.split(findNewlinesRegex).length,
				tokenEnd = i + tokenValue.length + k,
				// then get all new lines inside token value itself
				numLinesInToken = text
					.substring(i, tokenEnd)
					.split(findNewlinesRegex).length;

			let lineNumbers = [];
			// extract all lines number on which token value is present
			for (let i = 0; i < numLinesInToken; i++) {
				lineNumbers.push(numLinesBeforeToken + i + offset);
			}

			return {
				lineNumbers,
				tokenBegin: i,
				tokenEnd
			};
		}
	}

	return {
		lineNumbers: [],
		tokenBegin: -1,
		tokenEnd: -1
	};
};

module.exports = {
	newLinesRegex,
	tabRegex,
	findAllTokensRegex,
	findAllExpressionsRegex,
	findAllStatementsRegex,
	isCompound,
	isIdentifier,
	isBinaryExpression,
	isLiteral,
	isMemberExpression,
	isCallExpression,
	isClosingToken,
	extractTokenText,
	getLineNumber
};

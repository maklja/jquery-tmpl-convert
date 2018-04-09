const newLinesRegex = /(\r\n\t|\n|\r\t)/gm;
const tabRegex = /\t+/g;
const findAllTokensRegex = /({{(.+?)}})|(\${(.+?)})/g;
// eslint-disable-next-line
const findAllExpressionsRegex = '(\\${(.+?)})';
const findAllStatementsRegex = '({{(.+?)}})';

const isCompound = tokenTree => tokenTree.type === 'Compound';
const isIdentifier = tokenTree => tokenTree.type === 'Identifier';
const isBinaryExpression = tokenTree => tokenTree.type === 'BinaryExpression';
const isLiteral = tokenTree => tokenTree.type === 'Literal';
const isMemberExpression = tokenTree => tokenTree.type === 'MemberExpression';
const isCallExpression = tokenTree => tokenTree.type === 'CallExpression';

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
	} else {
		throw new Error(`Unsupported token type ${tree.type}`);
	}
};

const isClosingToken = tokenTree =>
	isBinaryExpression(tokenTree) &&
	tokenTree.operator === '/' &&
	tokenTree.left === false &&
	isIdentifier(tokenTree.right);

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
	extractTokenText
};

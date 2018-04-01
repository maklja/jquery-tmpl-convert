const newLinesRegex = /(\r\n\t|\n|\r\t)/gm;
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

const extractTokenText = tree => {
	if (isIdentifier(tree)) {
		return tree.name;
	} else if (isLiteral(tree)) {
		return tree.raw;
	} else if (isMemberExpression(tree)) {
		return `${extractTokenText(tree.object)}.${extractTokenText(
			tree.property
		)}`;
	} else if (isCallExpression(tree)) {
		let argumentsText = tree.arguments
			.map(curParam => extractTokenText(curParam))
			.join(',');
		return `${extractTokenText(tree.callee)}(${argumentsText})`;
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

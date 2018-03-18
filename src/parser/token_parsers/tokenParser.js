const newLinesRegex = /(\r\n\t|\n|\r\t)/gm;
const findAllTokensRegex = /({{(.+?)}})|(\${(.+?)})/g;
const tokenWithoutStatement = tokenName =>
	new RegExp(`(${tokenName}(\\((.*?)\\))?)`, 'g');
const tokenFunctionWithParameters = tokenName =>
	new RegExp(`${tokenName}(\\((.+?)\\))+`, 'g');

const getBracketLengths = (token, pattern) => {
	const bracketLengths = token
		.split(token.match(pattern).pop())
		.map(brackets => brackets.length);

	return {
		startLength: bracketLengths[0],
		endLength: bracketLengths[1]
	};
};

module.exports = {
	newLinesRegex,
	findAllTokensRegex,
	tokenWithoutStatement,
	tokenFunctionWithParameters,
	getBracketLengths
};

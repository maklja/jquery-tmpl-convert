const tokenStart = (text, position, tokenValue) => {
	for (let curChar of tokenValue) {
		if (curChar !== text[position++]) {
			return false;
		}
	}

	return true;
};

const tokenEnd = (text, position, tokenEndValue) => {
	for (let curChar of tokenEndValue) {
		if (curChar !== text[position++]) {
			return false;
		}
	}

	return true;
};

module.exports = {
	tokenStart,
	tokenEnd
};

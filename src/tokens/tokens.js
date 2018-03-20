const UNKNOWN = {
	name: 'unknown'
};

const VAR = {
	name: 'var',
	token: null,
	pattern: /\${(.+?)}/,
	start: '${',
	end: '}'
};

const IF_START = {
	name: 'if_start',
	token: 'if',
	pattern: /if .+?(?=}})/g
};

const ELSE = {
	name: 'else',
	token: 'else',
	pattern: /else( .+?(?=}}))?/g,
	hasEndToken: true
};

const IF_END = {
	name: 'if_end',
	token: '/if',
	pattern: /\/if(?=}})/g
};

const HTML = {
	name: 'html',
	token: 'html',
	pattern: /html .+?(?=}})/g
};

const EACH_START = {
	name: 'each_start',
	token: 'each',
	pattern: /(each(\((.*?)\))?) .+?(?=}})/g,
	hasEndToken: true
};

const EACH_END = {
	name: 'each_end',
	token: '/each',
	pattern: /\/each(?=}})/g
};

const WRAP_START = {
	name: 'wrap_start',
	token: 'wrap',
	pattern: /(wrap(\((.*?)\))?) .+?(?=}})/g
};

const WRAP_END = {
	name: 'wrap-end',
	token: '/wrap',
	pattern: /\/wrap(?=}})/g
};

const TMPL = {
	name: 'tmpl',
	token: 'tmpl',
	pattern: /(tmpl(\((.*?)\))?) .+?(?=}})/g
};

const tokens = [
	VAR,
	IF_START,
	ELSE,
	IF_END,
	HTML,
	EACH_START,
	EACH_END,
	WRAP_START,
	WRAP_END,
	TMPL,
	UNKNOWN
];

module.exports = {
	UNKNOWN,
	VAR,
	IF_START,
	// else must go before else if
	ELSE,
	IF_END,
	HTML,
	EACH_START,
	EACH_END,
	WRAP_START,
	WRAP_END,
	TMPL,
	tokens
};

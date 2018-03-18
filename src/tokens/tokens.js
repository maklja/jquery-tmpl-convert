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
	pattern: /(if(\((.*?)\))?) .+?(?=}})/g
};

const ELSE_IF = {
	name: 'else_if',
	pattern: /(if(\((.*?)\))?)( .+)?/,
	start: '{{else ',
	end: '}}'
};

const ELSE = {
	name: 'else',
	token: 'else',
	pattern: /else( .+?(?=}}))?/g
};

const IF_END = {
	name: 'if_end',
	token: '/if',
	pattern: /\/if(?=}})/g
};

const HTML = {
	name: 'html',
	pattern: /(html(\((.*?)\))?)( .+)?/g,
	start: '{{html',
	end: '}}'
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
	start: '{{wrap ',
	end: '}}'
};

const WRAP_END = {
	name: 'wrap-end',
	token: '/wrap',
	start: '{{/wrap}',
	end: ''
};

const TMPL = {
	name: 'tmpl',
	token: 'tmpl',
	start: '{{tmpl',
	end: '}}'
};

const tokens = [
	VAR,
	IF_START,
	// else must go before else if
	ELSE,
	// ELSE_IF,
	IF_END,
	// HTML,
	EACH_START,
	EACH_END
	// WRAP_START,
	// WRAP_END,
	// TMPL,
	// UNKNOWN
];

module.exports = {
	UNKNOWN,
	VAR,
	IF_START,
	// else must go before else if
	ELSE,
	ELSE_IF,
	IF_END,
	HTML,
	EACH_START,
	EACH_END,
	WRAP_START,
	WRAP_END,
	TMPL,
	tokens
};

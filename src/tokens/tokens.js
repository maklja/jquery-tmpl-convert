const UNKNOWN = {
	name: 'unknown'
};

const VARIABLE = {
	name: 'var',
	start: '${',
	end: '}'
};

const IF_START = {
	name: 'if_start',
	start: '{{if ',
	end: '}}'
};

const ELSE_IF = {
	name: 'else',
	start: '{{else ',
	end: '}}'
};

const ELSE = {
	name: 'else',
	start: '{{else}}',
	end: ''
};

const IF_END = {
	name: 'if_end',
	start: '{{/if}}',
	end: ''
};

const HTML = {
	name: 'html',
	start: '{{html',
	end: '}}'
};

const EACH_START = {
	name: 'each_start',
	start: '{{each',
	end: '}}'
};

const EACH_END = {
	name: 'each_end',
	start: '{{/each}}',
	end: ''
};

const WRAP_START = {
	name: 'wrap_start',
	start: '{{wrap ',
	end: '}}'
};

const WRAP_END = {
	name: 'wrap-end',
	start: '{{/wrap}',
	end: ''
};

const TMPL = {
	name: 'tmpl',
	start: '{{tmpl',
	end: '}}'
};

const tokens = [
	VARIABLE,
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
	UNKNOWN
];

module.exports = {
	UNKNOWN,
	VARIABLE,
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

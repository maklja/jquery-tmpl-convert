const chai = require('chai');
const { getLineNumber } = require('../../src/parser/parserUtils');

const expect = chai.expect;

describe('Test line number', () => {
	it('Single line template', () => {
		let lineNumbers = getLineNumber(
			'{{each collection}}{{/each}}',
			'{{each collection}}'
		);

		expect(lineNumbers)
			.to.be.an('object')
			.that.have.property('lineNumbers')
			.that.have.lengthOf(1)
			.that.have.members([1]);
	});

	it('Single line template closing token', () => {
		let lineNumbers = getLineNumber(
			'{{each collection}}{{/each}}',
			'{{/each}}'
		);

		expect(lineNumbers)
			.to.be.an('object')
			.that.have.property('lineNumbers')
			.that.have.lengthOf(1)
			.that.have.members([1]);
	});

	it('Two lines template', () => {
		let template = '{{each collection}}\n{{/each}}',
			lineNumbers = getLineNumber(template, '{{each collection}}');

		expect(lineNumbers)
			.to.be.an('object')
			.that.have.property('lineNumbers')
			.that.have.lengthOf(1)
			.that.have.members([1]);
	});

	it('Two lines template closing token', () => {
		let template = '{{each collection}}\n{{/each}}',
			lineNumbers = getLineNumber(template, '{{/each}}');

		expect(lineNumbers)
			.to.be.an('object')
			.that.have.property('lineNumbers')
			.that.have.lengthOf(1)
			.that.have.members([2]);
	});

	it('Four lines template closing token', () => {
		let template = '{{each collection}}\n\n\n{{/each}}',
			lineNumbers = getLineNumber(template, '{{/each}}');

		expect(lineNumbers)
			.to.be.an('object')
			.that.have.property('lineNumbers')
			.that.have.lengthOf(1)
			.that.have.members([4]);
	});

	it('Four lines template opening token with new line', () => {
		// eslint-disable-next-line no-template-curly-in-string
		let template = '${test}\n\n\n{{each \ncollection}}{{/each}}',
			lineNumbers = getLineNumber(template, '{{each collection}}');

		expect(lineNumbers)
			.to.be.an('object')
			.that.have.property('lineNumbers')
			.that.have.lengthOf(2)
			.that.have.members([4, 5]);
	});

	it('Four lines template opening token with multiple spaces around expression', () => {
		// eslint-disable-next-line no-template-curly-in-string
		let template = '${test}\n\n\n{{each     collection     }}{{/each}}',
			lineNumbers = getLineNumber(
				template,
				'{{each     collection     }}'
			);

		expect(lineNumbers)
			.to.be.an('object')
			.that.have.property('lineNumbers')
			.that.have.lengthOf(1)
			.that.have.members([4]);
	});

	it('Multiline if statement', () => {
		// eslint-disable-next-line no-template-curly-in-string
		let template =
				'{{if \nx != null &&\n y != null &&\n z != null}}{{/if}}',
			lineNumbers = getLineNumber(
				template,
				'{{if x != null && y != null && z != null}}'
			);

		expect(lineNumbers)
			.to.be.an('object')
			.that.have.property('lineNumbers')
			.that.have.lengthOf(4)
			.that.have.members([1, 2, 3, 4]);
	});
});

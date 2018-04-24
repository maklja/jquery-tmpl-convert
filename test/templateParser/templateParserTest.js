const chai = require('chai');
const path = require('path');
const TemplateParser = require('../../src/parser/TemplateParser');
const TemplateModel = require('../../src/model/TemplateModel');

const expect = chai.expect;

describe('Template Parser', () => {
	const checkTemplateModel = (
		tmplModel,
		expectedId,
		expectedType,
		expectedPath
	) => {
		const model = expect(tmplModel).to.be.instanceof(TemplateModel);
		model.that.have.property('id').that.is.equal(expectedId);
		model.that.have.property('type').that.is.equal(expectedType);
		model.that.have.property('path').that.is.equal(expectedPath);
		model.that.have.property('errors').that.an('array').that.is.empty;
	};

	describe('Test template loading', () => {
		it('Load single file path with multiple template inside', done => {
			const simpleTestTemplatePath = path.resolve(
				__dirname,
				'./templates/simpleTestTemplate.html'
			);
			const templateParser = new TemplateParser([simpleTestTemplatePath]);

			templateParser
				.loadTemplates()
				.then(() => {
					const templatesModels = templateParser.templates;
					expect(templatesModels)
						.to.be.an('array')
						.that.have.lengthOf(2);

					checkTemplateModel(
						templatesModels.find(tmpl => tmpl.id === 'varTemplate'),
						'varTemplate',
						'text/x-jquery-tmpl',
						simpleTestTemplatePath
					);

					checkTemplateModel(
						templatesModels.find(tmpl => tmpl.id === 'ifTemplate'),
						'ifTemplate',
						'text/x-jquery-tmpl',
						simpleTestTemplatePath
					);

					done();
				})
				.catch(e => {
					done(e);
				});
		});

		it('Load two files paths with multiple template inside', done => {
			const simpleTestTemplatePath = path.resolve(
				__dirname,
				'./templates/simpleTestTemplate.html'
			);
			const complexTestTemplatePath = path.resolve(
				__dirname,
				'./templates/complexTestTemplate.html'
			);
			const templateParser = new TemplateParser([
				simpleTestTemplatePath,
				complexTestTemplatePath
			]);

			templateParser
				.loadTemplates()
				.then(() => {
					const templatesModels = templateParser.templates;
					expect(templatesModels)
						.to.be.an('array')
						.that.have.lengthOf(4);

					checkTemplateModel(
						templatesModels.find(tmpl => tmpl.id === 'varTemplate'),
						'varTemplate',
						'text/x-jquery-tmpl',
						simpleTestTemplatePath
					);

					checkTemplateModel(
						templatesModels.find(tmpl => tmpl.id === 'ifTemplate'),
						'ifTemplate',
						'text/x-jquery-tmpl',
						simpleTestTemplatePath
					);

					checkTemplateModel(
						templatesModels.find(
							tmpl => tmpl.id === 'complexTemplate1'
						),
						'complexTemplate1',
						'text/x-jquery-tmpl',
						complexTestTemplatePath
					);

					checkTemplateModel(
						templatesModels.find(
							tmpl => tmpl.id === 'complexTemplate2'
						),
						'complexTemplate2',
						'text/x-jquery-tmpl',
						complexTestTemplatePath
					);

					done();
				})
				.catch(e => {
					done(e);
				});
		});

		it('Load files using regex paths with multiple template inside', done => {
			// TODO
			done();
			// const regexTemplatePath = path.resolve(
			// 	__dirname,
			// 	'./templates/*.html'
			// );
			// const templateParser = new TemplateParser([regexTemplatePath]);
			// const simpleTestTemplatePath = path.resolve(
			// 	__dirname,
			// 	'./templates/simpleTestTemplate.html'
			// );
			// const complexTestTemplatePath = path.resolve(
			// 	__dirname,
			// 	'./templates/complexTestTemplate.html'
			// );
            //
			// templateParser
			// 	.loadTemplates()
			// 	.then(() => {
			// 		const templatesModels = templateParser.templates;
			// 		expect(templatesModels)
			// 			.to.be.an('array')
			// 			.that.have.lengthOf(4);
            //
			// 		checkTemplateModel(
			// 			templatesModels.find(
			// 				tmpl => tmpl.id === 'complexTemplate1'
			// 			),
			// 			'complexTemplate1',
			// 			'text/x-jquery-tmpl',
			// 			complexTestTemplatePath
			// 		);
            //
			// 		checkTemplateModel(
			// 			templatesModels.find(
			// 				tmpl => tmpl.id === 'complexTemplate2'
			// 			),
			// 			'complexTemplate2',
			// 			'text/x-jquery-tmpl',
			// 			complexTestTemplatePath
			// 		);
            //
			// 		checkTemplateModel(
			// 			templatesModels.find(tmpl => tmpl.id === 'varTemplate'),
			// 			'varTemplate',
			// 			'text/x-jquery-tmpl',
			// 			simpleTestTemplatePath
			// 		);
            //
			// 		checkTemplateModel(
			// 			templatesModels.find(tmpl => tmpl.id === 'ifTemplate'),
			// 			'ifTemplate',
			// 			'text/x-jquery-tmpl',
			// 			simpleTestTemplatePath
			// 		);
            //
			// 		done();
			// 	})
			// 	.catch(e => {
			// 		done(e);
			// 	});
		});
	});

	describe('Test template parsing', () => {
		describe('Load simple template file and then', () => {
			it('parse all templates inside file', done => {
				const simpleTestTemplatePath = path.resolve(
					__dirname,
					'./templates/simpleTestTemplate.html'
				);
				const templateParser = new TemplateParser([
					simpleTestTemplatePath
				]);

				templateParser
					.parse()
					.then(() => {
						const templatesModels = templateParser.templates;
						expect(templatesModels)
							.to.be.an('array')
							.that.have.lengthOf(2);

						checkTemplateModel(
							templatesModels.find(
								tmpl => tmpl.id === 'varTemplate'
							),
							'varTemplate',
							'text/x-jquery-tmpl',
							simpleTestTemplatePath
						);

						checkTemplateModel(
							templatesModels.find(
								tmpl => tmpl.id === 'ifTemplate'
							),
							'ifTemplate',
							'text/x-jquery-tmpl',
							simpleTestTemplatePath
						);

						done();
					})
					.catch(e => {
						done(e);
					});
			});
		});
	});
});

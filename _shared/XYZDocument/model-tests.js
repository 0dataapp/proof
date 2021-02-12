const { throws, deepEqual } = require('assert');

const mod = require('./model.js').default;

describe('XYZDocumentModelErrorsFor', function test_XYZDocumentModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mod.XYZDocumentModelErrorsFor(null);
		}, /XYZErrorInputNotValid/);
	});

	it('returns object if XYZDocumentID not string', function() {
		deepEqual(mod.XYZDocumentModelErrorsFor(Object.assign(StubDocumentObjectValid(), {
			XYZDocumentID: null,
		})), {
			XYZDocumentID: [
				'XYZErrorNotString',
			],
		});
	});

	it('returns object if XYZDocumentID not filled', function() {
		deepEqual(mod.XYZDocumentModelErrorsFor(Object.assign(StubDocumentObjectValid(), {
			XYZDocumentID: ' ',
		})), {
			XYZDocumentID: [
				'XYZErrorNotFilled',
			],
		});
	});

	it('returns object if XYZDocumentName not string', function() {
		deepEqual(mod.XYZDocumentModelErrorsFor(Object.assign(StubDocumentObjectValid(), {
			XYZDocumentName: null,
		})), {
			XYZDocumentName: [
				'XYZErrorNotString',
			],
		});
	});

	it('returns object if XYZDocumentCreationDate not date', function() {
		deepEqual(mod.XYZDocumentModelErrorsFor(Object.assign(StubDocumentObjectValid(), {
			XYZDocumentCreationDate: new Date('alfa'),
		})), {
			XYZDocumentCreationDate: [
				'XYZErrorNotDate',
			],
		});
	});

	it('returns object if XYZDocumentModificationDate not date', function() {
		deepEqual(mod.XYZDocumentModelErrorsFor(Object.assign(StubDocumentObjectValid(), {
			XYZDocumentModificationDate: new Date('alfa'),
		})), {
			XYZDocumentModificationDate: [
				'XYZErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mod.XYZDocumentModelErrorsFor(StubDocumentObjectValid()), null);
	});

	context('XYZOptionValidateIfNotPresent', function() {

		it('returns object if not valid', function() {
			deepEqual(Object.keys(mod.XYZDocumentModelErrorsFor({}, {
				XYZOptionValidateIfNotPresent: true,
			})), [
				'XYZDocumentID',
				'XYZDocumentName',
				'XYZDocumentCreationDate',
				'XYZDocumentModificationDate',
			]);
		});

	});

});

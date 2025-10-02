const { rejects, throws, deepEqual } = require('assert');

const mod = require('./main.js').default;

describe('ZDRSchemaStub', function ZDRSchemaStub() {

	it('returns string', function() {
		const $XYZDocumentID = Math.random().toString();
		deepEqual(mod.ZDRSchemaStub($XYZDocumentID), {
			$XYZDocumentID,
		});
	});

});

describe('ZDRSchemaPath', function ZDRSchemaPath() {

	it('returns string', function() {
		const $XYZDocumentID = Math.random().toString();
		deepEqual(mod.ZDRSchemaPath({
			$XYZDocumentID,
		}), $XYZDocumentID);
	});

});

describe('ZDRSchemaDispatchValidate', function test_ZDRSchemaDispatchValidate() {

	it('throws error if not object', function() {
		throws(function() {
			mod.ZDRSchemaDispatchValidate(null);
		}, /XYZErrorInputNotValid/);
	});

	it('returns object if $XYZDocumentID not string', function() {
		deepEqual(mod.ZDRSchemaDispatchValidate(Object.assign(StubDocumentObjectValid(), {
			$XYZDocumentID: null,
		})), {
			$XYZDocumentID: [
				'XYZErrorNotString',
			],
		});
	});

	it('returns object if $XYZDocumentID not filled', function() {
		deepEqual(mod.ZDRSchemaDispatchValidate(Object.assign(StubDocumentObjectValid(), {
			$XYZDocumentID: ' ',
		})), {
			$XYZDocumentID: [
				'XYZErrorNotFilled',
			],
		});
	});

	it('returns object if XYZDocumentName not string', function() {
		deepEqual(mod.ZDRSchemaDispatchValidate(Object.assign(StubDocumentObjectValid(), {
			XYZDocumentName: null,
		})), {
			XYZDocumentName: [
				'XYZErrorNotString',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mod.ZDRSchemaDispatchValidate(StubDocumentObjectValid()), null);
	});

	context('XYZOptionValidateIfNotPresent', function() {

		it('returns object if not valid', function() {
			deepEqual(Object.keys(mod.ZDRSchemaDispatchValidate({}, {
				XYZOptionValidateIfNotPresent: true,
			})), [
				'$XYZDocumentID',
				'XYZDocumentName',
			]);
		});

	});

});

describe('XYZDocumentCreate', function test_XYZDocumentActCreate() {

	it('throws if not object', function () {
		throws(function () {
			XYZTestingWrap.App.XYZDocument.XYZDocumentCreate(null)
		}, /XYZErrorInputNotValid/);
	});

	it('rejects with errors if not valid', async function() {
		await rejects(XYZTestingWrap.App.XYZDocument.XYZDocumentCreate(StubDocumentObject({
			XYZDocumentName: null,
		})), {
			XYZDocumentName: [
				'XYZErrorNotString',
			],
		});
	});

	it('returns XYZDocument', async function() {
		let item = await XYZTestingWrap.App.XYZDocument.XYZDocumentCreate(StubDocumentObject());

		deepEqual(item, StubDocumentObject({
			$XYZDocumentID: item.$XYZDocumentID,
			XYZDocumentName: item.XYZDocumentName,
		}));
	});

	it('sets $XYZDocumentID to unique value', async function() {
		let items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await XYZTestingWrap.App.XYZDocument.XYZDocumentCreate(StubDocumentObject())).$XYZDocumentID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('allows overwrite by input', async function() {
		const item = StubDocumentObjectValid();
		deepEqual(await XYZTestingWrap.App.XYZDocument.XYZDocumentCreate(Object.assign({}, item)), item);
	});

});

describe('XYZDocumentUpdate', function test_XYZDocumentActUpdate() {

	it('throws if not object', function () {
		throws(function () {
			XYZTestingWrap.App.XYZDocument.XYZDocumentUpdate(null)
		}, /XYZErrorInputNotValid/);
	});

	it('rejects with errors if not valid', async function() {
		await rejects(XYZTestingWrap.App.XYZDocument.XYZDocumentUpdate(Object.assign(await XYZTestingWrap.App.XYZDocument.XYZDocumentCreate(StubDocumentObject()), {
			XYZDocumentName: null,
		})), {
			XYZDocumentName: [
				'XYZErrorNotString',
			],
		});
	});

	it('returns XYZDocument', async function() {
		let itemCreated = await XYZTestingWrap.App.XYZDocument.XYZDocumentCreate(StubDocumentObject());

		let item = await XYZTestingWrap.App.XYZDocument.XYZDocumentUpdate(itemCreated);

		deepEqual(item, itemCreated);
	});

	it('writes inputData if not found', async function() {
		let item = await XYZTestingWrap.App.XYZDocument.XYZDocumentUpdate(Object.assign(StubDocumentObject(), {
			$XYZDocumentID: 'alfa',
		}));
		deepEqual(item, Object.assign(StubDocumentObject(), {
			$XYZDocumentID: item.$XYZDocumentID,
			XYZDocumentName: item.XYZDocumentName,
		}));
	});

});

describe('XYZDocumentList', function test_XYZDocumentActList() {

	it('returns array', async function() {
		deepEqual(await XYZTestingWrap.App.XYZDocument.XYZDocumentList(), []);
	});

	it('returns array with existing items', async function() {
		const item = await XYZTestingWrap.App.XYZDocument.XYZDocumentCreate(StubDocumentObject());
		deepEqual(await XYZTestingWrap.App.XYZDocument.XYZDocumentList(), [item]);
	});

});

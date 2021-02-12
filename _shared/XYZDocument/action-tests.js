const { rejects, deepEqual } = require('assert');

const mod = require('./action.js').default;

describe('XYZDocumentActionCreate', function test_XYZDocumentActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mod.XYZDocumentActionCreate(XYZTestingStorageClient, null), /XYZErrorInputNotValid/);
	});

	it('returns object with XYZErrors if not valid', async function() {
		deepEqual((await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject({
			XYZDocumentName: null,
		}))).XYZErrors, {
			XYZDocumentName: [
				'XYZErrorNotString',
			],
		});
	});

	it('returns XYZDocument', async function() {
		let item = await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject());

		deepEqual(item, StubDocumentObject({
			XYZDocumentID: item.XYZDocumentID,
			XYZDocumentName: item.XYZDocumentName,
			XYZDocumentCreationDate: item.XYZDocumentCreationDate,
			XYZDocumentModificationDate: item.XYZDocumentModificationDate,
		}));
	});

	it('sets XYZDocumentID to unique value', async function() {
		let items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject())).XYZDocumentID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets XYZDocumentCreationDate to now', async function() {
		deepEqual(new Date() - (await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject())).XYZDocumentCreationDate < 100, true);
	});

	it('sets XYZDocumentModificationDate to now', async function() {
		deepEqual(new Date() - (await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject())).XYZDocumentModificationDate < 100, true);
	});

	it('allows overwrite by input', async function() {
		const item = StubDocumentObjectValid();
		deepEqual(await mod.XYZDocumentActionCreate(XYZTestingStorageClient, Object.assign({}, item)), item);
	});

});

describe('XYZDocumentActionUpdate', function test_XYZDocumentActionUpdate() {

	it('rejects if not object', async function() {
		await rejects(mod.XYZDocumentActionUpdate(XYZTestingStorageClient, null), /XYZErrorInputNotValid/);
	});

	it('returns object with XYZErrors if not valid', async function() {
		deepEqual((await mod.XYZDocumentActionUpdate(XYZTestingStorageClient, Object.assign(await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject()), {
			XYZDocumentID: null,
		}))).XYZErrors, {
			XYZDocumentID: [
				'XYZErrorNotString',
			],
		});
	});

	it('returns XYZDocument', async function() {
		let itemCreated = await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject());

		let item = await mod.XYZDocumentActionUpdate(XYZTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			XYZDocumentModificationDate: item.XYZDocumentModificationDate,
		}));
	});

	it('sets XYZDocumentModificationDate to now', async function() {
		deepEqual(new Date() - (await mod.XYZDocumentActionUpdate(XYZTestingStorageClient, await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject()))).XYZDocumentModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		let item = await mod.XYZDocumentActionUpdate(XYZTestingStorageClient, Object.assign(StubDocumentObject(), {
			XYZDocumentID: 'alfa',
			XYZDocumentCreationDate: new Date(),
		}));
		deepEqual(item, Object.assign(StubDocumentObject(), {
			XYZDocumentID: item.XYZDocumentID,
			XYZDocumentName: item.XYZDocumentName,
			XYZDocumentCreationDate: item.XYZDocumentCreationDate,
			XYZDocumentModificationDate: item.XYZDocumentModificationDate,
		}));
	});

});

describe('XYZDocumentActionDelete', function test_XYZDocumentActionDelete() {

	it('rejects if not valid', async function() {
		await rejects(mod.XYZDocumentActionDelete(XYZTestingStorageClient, {}), /XYZErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mod.XYZDocumentActionDelete(XYZTestingStorageClient, await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject())), {
			statusCode: 200,
		});
	});

	it('deletes XYZDocument', async function() {
		await mod.XYZDocumentActionDelete(XYZTestingStorageClient, await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject()));
		deepEqual(await mod.XYZDocumentActionList(XYZTestingStorageClient), []);
	});

});

describe('XYZDocumentActionList', function test_XYZDocumentActionList() {

	it('returns array', async function() {
		deepEqual(await mod.XYZDocumentActionList(XYZTestingStorageClient), []);
	});

	it('returns array with existing XYZDocuments', async function() {
		let item = await mod.XYZDocumentActionCreate(XYZTestingStorageClient, StubDocumentObject());

		deepEqual(await mod.XYZDocumentActionList(XYZTestingStorageClient), [item]);
	});

});

const { rejects, throws, deepEqual } = require('assert');

const mod = require('./storage.js').default;

const OLSKRemoteStorage = require('OLSKRemoteStorage');

describe('XYZDocumentStorageCollectionName', function test_XYZDocumentStorageCollectionName() {

	it('returns string', function() {
		deepEqual(mod.XYZDocumentStorageCollectionName(), 'xyz_documents');
	});

});

describe('XYZDocumentStorageObjectPath', function test_XYZDocumentStorageObjectPath() {

	it('throws error if blank', function() {
		throws(function() {
			mod.XYZDocumentStorageObjectPath('');
		}, /XYZErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = Math.random().toString();
		deepEqual(mod.XYZDocumentStorageObjectPath(item), item);
	});

});

describe('XYZDocumentStorageWrite', function test_XYZDocumentStorageWrite() {

	it('rejects if not object', async function() {
		await rejects(mod.XYZDocumentStorageWrite(XYZTestingStorageClient, null), /XYZErrorInputNotValid/);
	});

	it('returns object with XYZErrors if not valid', async function() {
		deepEqual((await mod.XYZDocumentStorageWrite(XYZTestingStorageClient, Object.assign(StubDocumentObjectValid(), {
			XYZDocumentID: null,
		}))).XYZErrors, {
			XYZDocumentID: [
				'XYZErrorNotString',
			],
		});
	});

	it('returns input', async function () {
		const item = StubDocumentObjectValid();

		deepEqual(await mod.XYZDocumentStorageWrite(XYZTestingStorageClient, item) === item, true);
	});

	it('leaves input unmodified', async function () {
		const item = StubDocumentObjectValid()
		deepEqual(await mod.XYZDocumentStorageWrite(XYZTestingStorageClient, Object.assign({}, item)), item);
	});

	context('relations', function () {

		const item = Object.assign(StubDocumentObjectValid(), {
			$alfa: 'bravo',
		});
		let outputData, storage;

		before(async function () {
			outputData = await mod.XYZDocumentStorageWrite(XYZTestingStorageClient, item);
		});
		
		before(async function () {
			storage = Object.values(await mod.XYZDocumentStorageList(XYZTestingStorageClient));
		});
		
		it('excludes from storage', function () {
			deepEqual(storage, [StubDocumentObjectValid()]);
		});
		
		it('includes in outputData', function () {
			deepEqual(outputData, item);
		});

		it('updates inputData', function () {
			deepEqual(outputData === item, true);
		});
	
	});

});

describe('XYZDocumentStorageList', function test_XYZDocumentStorageList() {

	it('returns empty array if none', async function() {
		deepEqual(await mod.XYZDocumentStorageList(XYZTestingStorageClient), {});
	});

	it('returns existing XYZDocuments', async function() {
		let item = await mod.XYZDocumentStorageWrite(XYZTestingStorageClient, StubDocumentObjectValid());
		deepEqual(Object.values(await mod.XYZDocumentStorageList(XYZTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mod.XYZDocumentStorageList(XYZTestingStorageClient)), [item.XYZDocumentID]);
	});

	it('excludes if not JSON', async function() {
		const inputData = StubDocumentObjectValid({
			XYZDocumentID: Math.random().toString(),
		});

		await OLSKRemoteStorage._TestWriteFileText(XYZTestingStorageClient.test_rs_encrypt, mod.XYZDocumentStorageObjectPath(inputData.XYZDocumentID), 'test');

		deepEqual(await mod.XYZDocumentStorageList(XYZTestingStorageClient), {});
	});

});

describe('XYZDocumentStorageDelete', function test_XYZDocumentStorageDelete() {

	it('throws if not valid', function () {
		throws(function () {
			mod.XYZDocumentStorageDelete(XYZTestingStorageClient, {})
		}, /XYZErrorInputNotValid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mod.XYZDocumentStorageDelete(XYZTestingStorageClient, await mod.XYZDocumentStorageWrite(XYZTestingStorageClient, StubDocumentObjectValid())), {
			statusCode: 200,
		});
	});

	it('deletes XYZDocument', async function() {
		await mod.XYZDocumentStorageDelete(XYZTestingStorageClient, await mod.XYZDocumentStorageWrite(XYZTestingStorageClient, StubDocumentObjectValid()));
		deepEqual(await mod.XYZDocumentStorageList(XYZTestingStorageClient), {});
	});

});

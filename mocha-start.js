const RemoteStorage = require('remotestoragejs');

const XYZ_Data = require('./_shared/XYZ_Data/main.js').default;
const XYZDocumentStorage = require('./_shared/XYZDocument/storage.js').default;

(function XYZMochaStorage() {
	if (process.env.OLSK_SPEC_MOCHA_INTERFACE === 'true') {
		return;
	}

	const storageModule = XYZ_Data.XYZ_DataModule([
		XYZDocumentStorage.XYZDocumentStorageBuild,
	], {
		OLSKOptionIncludeDebug: true,
	});

	before(function() {
		global.XYZTestingStorageClient = new RemoteStorage({ modules: [ storageModule ] });

		global.XYZTestingStorageClient.access.claim(storageModule.name, 'rw');
	});

	beforeEach(function() {
		return global.XYZTestingStorageClient[storageModule.name].__DEBUG.__OLSKRemoteStorageReset();
	});
})();

(function XYZMochaStubs() {
	Object.entries({

		StubDocumentObject(inputData) {
			return Object.assign({
				XYZDocumentName: 'alfa',
			}, inputData);
		},

		StubDocumentObjectValid(inputData) {
			return Object.assign(StubDocumentObject({
				XYZDocumentID: 'bravo',
				XYZDocumentCreationDate: new Date('2019-02-23T13:56:36Z'),
				XYZDocumentModificationDate: new Date('2019-02-23T13:56:36Z'),
			}), inputData);
		},

		uSerial (inputData) {
			return inputData.reduce(async function (coll, e) {
				return e.then(Array.prototype.concat.bind(await coll));
			}, Promise.resolve([]));
		},

	}).map(function (e) {
		return global[e.shift()]  = e.pop();
	});
})();

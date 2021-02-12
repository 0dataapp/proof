import XYZDocumentModel from './model.js';
import OLSKRemoteStorage from 'OLSKRemoteStorage';

const mod = {

	XYZDocumentStorageCollectionName () {
		return 'xyz_documents';
	},

	XYZDocumentStorageObjectPath (inputData) {
		if (!inputData) {
			throw new Error('XYZErrorInputNotValid');
		}

		return inputData;
	},

	XYZDocumentStorageBuild (privateClient, publicClient, changeDelegate) {
		privateClient.on('change', function (event) {
			if (!changeDelegate) {
				return;
			}
			
			const delegateMethod = OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateProperty(event);

			if (!delegateMethod) {
				return;
			}

			if (typeof changeDelegate[delegateMethod] !== 'function') {
				return console.warn(`${ delegateMethod } not function`);
			}

			changeDelegate[delegateMethod](OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(event[OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateInput(delegateMethod)]));
		});

		const OLSKRemoteStorageCollectionExports = {

			async _XYZDocumentStorageWrite (inputData) {
				if (typeof inputData !== 'object' || inputData === null) {
					return Promise.reject(new Error('XYZErrorInputNotValid'));
				}

				let errors = XYZDocumentModel.XYZDocumentModelErrorsFor(inputData);
				if (errors) {
					return Promise.resolve({
						XYZErrors: errors,
					});
				}

				try {
					return OLSKRemoteStorage.OLSKRemoteStorageWriteObject(privateClient, mod.XYZDocumentStorageObjectPath(inputData.XYZDocumentID), inputData);
				} catch (e) {
					return Promise.reject(e);
				}
			},

			async _XYZDocumentStorageList () {
				return (await Promise.all((await OLSKRemoteStorage.OLSKRemoteStorageListingRecursive(privateClient, '')).map(async function (e) {
					try {
						return await privateClient.getObject(e, false);
					} catch (error) {
						return null;
					}
				}))).reduce(function (coll, item) {
					if (item) {
						coll[item.XYZDocumentID] = OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(item);
					}

					return coll;
				}, {});
			},
			
			_XYZDocumentStorageDelete (inputData) {
				if (XYZDocumentModel.XYZDocumentModelErrorsFor(inputData)) {
					throw new Error('XYZErrorInputNotValid');
				}

				return privateClient.remove(mod.XYZDocumentStorageObjectPath(inputData.XYZDocumentID));
			},
			
		};

		return {
			OLSKRemoteStorageCollectionName: mod.XYZDocumentStorageCollectionName(),
			OLSKRemoteStorageCollectionExports,
		};
	},

	XYZDocumentStorageWrite (storageClient, inputData) {
		return storageClient.test_rs_encrypt[mod.XYZDocumentStorageCollectionName()]._XYZDocumentStorageWrite(inputData);
	},

	XYZDocumentStorageList (storageClient) {
		return storageClient.test_rs_encrypt[mod.XYZDocumentStorageCollectionName()]._XYZDocumentStorageList();
	},

	XYZDocumentStorageDelete (storageClient, inputData) {
		return storageClient.test_rs_encrypt[mod.XYZDocumentStorageCollectionName()]._XYZDocumentStorageDelete(inputData);
	},

};

export default mod;

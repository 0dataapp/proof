import { factory } from 'ulid';
const uniqueID = factory();

import XYZDocumentStorage from './storage.js';

const mod = {

	async XYZDocumentActionCreate (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('XYZErrorInputNotValid'));
		}

		const creationDate = new Date();

		return await XYZDocumentStorage.XYZDocumentStorageWrite(storageClient, Object.assign({
			XYZDocumentID: uniqueID(),
			XYZDocumentCreationDate: creationDate,
			XYZDocumentModificationDate: creationDate,
		}, inputData));
	},

	async XYZDocumentActionUpdate (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('XYZErrorInputNotValid'));
		}

		return await XYZDocumentStorage.XYZDocumentStorageWrite(storageClient, Object.assign(inputData, {
			XYZDocumentModificationDate: new Date(),
		}));
	},

	async XYZDocumentActionDelete (storageClient, inputData) {
		return await XYZDocumentStorage.XYZDocumentStorageDelete(storageClient, inputData);
	},

	async XYZDocumentActionList (storageClient) {
		return Object.values(await XYZDocumentStorage.XYZDocumentStorageList(storageClient));
	},
	
};
	
export default mod;

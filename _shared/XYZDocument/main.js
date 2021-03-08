import { factory } from 'ulid';
const uniqueID = factory();
import OLSKRemoteStorage from 'OLSKRemoteStorage';

const mod = {

	ZDRSchemaKey: 'XYZDocument',

	ZDRSchemaStub (inputData) {
		return {
			XYZDocumentID: inputData,
		};
	},

	ZDRSchemaPath (inputData) {
		return inputData.XYZDocumentID;
	},

	ZDRSchemaDispatchValidate (inputData, options = {}) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('XYZErrorInputNotValid');
		}

		const errors = {};

		if (typeof inputData.XYZDocumentID !== 'string') {
			errors.XYZDocumentID = [
				'XYZErrorNotString',
			];
		} else if (!inputData.XYZDocumentID.trim()) {
			errors.XYZDocumentID = [
				'XYZErrorNotFilled',
			];
		}

		if (typeof inputData.XYZDocumentName !== 'string') {
			errors.XYZDocumentName = [
				'XYZErrorNotString',
			];
		}

		if (!(inputData.XYZDocumentCreationDate instanceof Date) || Number.isNaN(inputData.XYZDocumentCreationDate.getTime())) {
			errors.XYZDocumentCreationDate = [
				'XYZErrorNotDate',
			];
		}

		if (!(inputData.XYZDocumentModificationDate instanceof Date) || Number.isNaN(inputData.XYZDocumentModificationDate.getTime())) {
			errors.XYZDocumentModificationDate = [
				'XYZErrorNotDate',
			];
		}

		return Object.entries(errors).length ? errors : null;
	},

	ZDRSchemaMethods: {
		
		XYZDocumentCreate (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('XYZErrorInputNotValid');
			}

			const XYZDocumentCreationDate = new Date();

			return this.App.XYZDocument.ZDRModelWriteObject(Object.assign({
				XYZDocumentID: uniqueID(),
				XYZDocumentCreationDate,
				XYZDocumentModificationDate: XYZDocumentCreationDate,
			}, inputData));
		},

		XYZDocumentUpdate (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('XYZErrorInputNotValid');
			}

			return this.App.XYZDocument.ZDRModelWriteObject(Object.assign(inputData, {
				XYZDocumentModificationDate: new Date(),
			}));
		},

		async XYZDocumentList () {
			return Object.values(await this.App.XYZDocument.ZDRModelListObjects()).map(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse);
		},

	},

};

export default mod;

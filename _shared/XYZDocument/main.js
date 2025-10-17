import { ulid } from 'ulid';
const uniqueID = ulid;
import OLSKRemoteStorage from 'OLSKRemoteStorage';

const inject = function (object, properties) {
  return Object.assign(Object.assign({}, object), properties);
};

const uDescending = function (a, b) {
  return (a > b) ? -1 : ((a < b) ? 1 : 0);
};

const mod = {

	ZDRSchemaKey: 'XYZDocument',

	ZDRSchemaStub (inputData) {
		return {
			$XYZDocumentID: inputData,
		};
	},

	ZDRSchemaPath (inputData) {
		return inputData.$XYZDocumentID;
	},

	ZDRSchemaDispatchValidate (inputData, options = {}) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('XYZErrorInputNotValid');
		}

		const errors = {};

		if (typeof inputData.$XYZDocumentID !== 'string') {
			errors.$XYZDocumentID = [
				'XYZErrorNotString',
			];
		} else if (!inputData.$XYZDocumentID.trim()) {
			errors.$XYZDocumentID = [
				'XYZErrorNotFilled',
			];
		}

		if (typeof inputData.description !== 'string') {
			errors.description = [
				'XYZErrorNotString',
			];
		}

		return Object.entries(errors).length ? errors : null;
	},

	ZDRSchemaMethods: {
		
		XYZDocumentCreate (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('XYZErrorInputNotValid');
			}

			return this.App.XYZDocument.ZDRModelWriteObject(Object.assign({
				$XYZDocumentID: uniqueID(),
			}, inputData));
		},

		XYZDocumentUpdate (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('XYZErrorInputNotValid');
			}

			return this.App.XYZDocument.ZDRModelWriteObject(inputData);
		},

		async XYZDocumentList () {
			const _this = this;
			return (await Promise.all((await _this.App.XYZDocument._ZDRModelListObjects()).map(async e => [e, OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(await _this.App.ZDRStorageReadObject(e))]))).map(e => inject(e[1], {
				$XYZDocumentID: e[0].split('/').pop(),
			})).sort(function (a, b) {
			return uDescending(a.$XYZDocumentID, b.$XYZDocumentID)
		});
		},

	},

};

export default mod;

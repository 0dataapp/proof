import OLSKRemoteStorage from 'OLSKRemoteStorage';

import XYZDocumentAction from '../XYZDocument/action.js';

const mod = {

	XYZ_DataModule (inputData, options) {
		return OLSKRemoteStorage.OLSKRemoteStorageDataModuleGenerator('test_rs_encrypt', options)(inputData);
	},

};

export default mod;

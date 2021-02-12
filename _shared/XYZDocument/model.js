const mod = {

	XYZDocumentModelErrorsFor (inputData, options = {}) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('XYZErrorInputNotValid');
		}

		const errors = {};

		if (typeof inputData.XYZDocumentID !== 'string') {
			errors.XYZDocumentID = [
				'XYZErrorNotString',
			];
		} else if (inputData.XYZDocumentID.trim() === '') {
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

};

export default mod;

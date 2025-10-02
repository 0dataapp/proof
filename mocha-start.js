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
			}), inputData);
		},

		uSerial (inputData) {
			return inputData.reduce(async function (coll, e) {
				return e.then(Array.prototype.concat.bind(await coll));
			}, Promise.resolve([]));
		},

	}).map(function (e) {
		return global[e.shift()] = e.pop();
	});
})();

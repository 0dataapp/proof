const kProofServiceWorkerVersionID = Date.now().toString();

const OLSKServiceWorker = require('./node_modules/OLSKServiceWorker/main.js');

exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'RSEncryptProofRoute',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKExpressLayoutRender(require('path').join(__dirname, 'stub-view'));
		},
		OLSKRouteLanguageCodes: ['en'],
	}, {
		OLSKRoutePath: '/sw.js',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'FissionProofServiceWorkerRoute',
		OLSKRouteFunction(req, res, next) {
			return res.type('js').send(OLSKServiceWorker.OLSKServiceWorkerView({
				VERSION_ID_TOKEN: kProofServiceWorkerVersionID,
				ORIGIN_PAGE_PATH_TOKEN: res.locals.OLSKCanonical('RSEncryptProofRoute'),
			}));
		},
	}];
};

exports.OLSKControllerSharedStaticAssetFolders = function () {
	return [
		'node_modules',
	];
};


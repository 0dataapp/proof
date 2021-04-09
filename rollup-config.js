export default require('OLSKRollupScaffold').OLSKRollupScaffoldScanStart(__dirname, {
	OLSKRollupScanIncludeStubs: [__dirname + '/rollup-start.js'],
	OLSKRollupPluginSwapTokens: Object.assign(require('OLSKUIAssets').OLSKUIAssetsSwapTokens(), {
		XYZ_REPO_URL_SWAP_TOKEN: process.env.XYZ_REPO_URL,
	}),
});

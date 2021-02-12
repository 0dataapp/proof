export default require('OLSKRollupScaffold').OLSKRollupScaffoldScanStart(__dirname, {
	OLSKRollupScanIncludeStubs: [__dirname + '/rollup-start.js'],
	OLSKRollupPluginSwapTokens: Object.assign(require('OLSKUIAssets').OLSKUIAssetsSwapTokens(), {
	}),
});

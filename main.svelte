<script>
import OLSKRemoteStorage from 'OLSKRemoteStorage';
import OLSKObject from 'OLSKObject';
import XYZDocument from './_shared/XYZDocument/main.js';
import OLSKThrottle from 'OLSKThrottle';
import OLSKLocalStorage from 'OLSKLocalStorage';
import OLSKServiceWorker from 'OLSKServiceWorker';
import zerodatawrap from 'zerodatawrap';

import RemoteStorage from 'remotestoragejs';
const wn = webnative;

import { OLSKLocalized } from 'OLSKInternational';

const ZDRScopeDirectory = 'test_fission';

const uSerial = function (inputData) {
	return inputData.reduce(async function (coll, item) {
		return item.then(Array.prototype.concat.bind(await coll));
	}, Promise.resolve([]));
};

const uDescending = function (a, b) {
  return (a > b) ? -1 : ((a < b) ? 1 : 0);
};

const mod = {

	// VALUE

	_ValueSaveThrottleMap: {},

	_ValueCloudToolbarHidden: true,

	// DATA

	DataItemValid () {
		const date = new Date();

		return {
			XYZDocumentName: '',
			// non-storage
			XYZDocumentID: Date.now().toString(),
			XYZDocumentCreationDate: date,
			XYZDocumentModificationDate: date,
		};
	},

	DataRecipes () {
		const items = [];

		items.push(...OLSKServiceWorker.OLSKServiceWorkerRecipes(window, mod.DataNavigator(), OLSKLocalized, OLSK_SPEC_UI()));

		// items.push(...OLSKRemoteStorage.OLSKRemoteStorageRecipes({
		// 	ParamWindow: window,
		// 	ParamStorage: mod._ValueOLSKRemoteStorage,
		// 	OLSKLocalized: OLSKLocalized,
		// 	ParamMod: mod,
		// 	ParamSpecUI: false,
		// });
	
		return items;
	},

	// INTERFACE

	InterfaceCreateButtonDidClick () {
		mod.ControlItemCreate();
	},

	InterfaceBackButtonDidClick () {
		mod._OLSKCatalog.modPublic.OLSKCatalogFocusMaster();
	},

	InterfaceDiscardButtonDidClick () {
		mod.ControlItemDiscard(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	InterfaceFieldDidInput () {
		mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected().XYZDocumentName = this.value;

		mod.ControlItemUpdate(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());

		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	InterfaceWindowDidKeydown (event) {
		if (document.querySelector('.LCHLauncher')) { // #spec
			return;
		}

		const handlerFunctions = {

			Tab () {
				document.activeElement !== document.querySelector('.OLSKMasterListFilterField') ? mod._OLSKCatalog.modPublic.OLSKCatalogFocusMaster() : mod.ControlFocusDetail();

				event.preventDefault();
			},
			
		};

		handlerFunctions[event.key] && handlerFunctions[event.key]();
	},

	InterfaceAuthenticateButtonDidClick () {
		mod.ControlAuthenticate();
	},

	// CONTROL

	async ControlItemCreate () {
		mod.ControlItemSelect(mod._OLSKCatalog.modPublic.OLSKCatalogInsert(await mod._ValueZDRWrap.App.XYZDocument.XYZDocumentCreate(mod.DataItemValid())));
	},

	ControlItemUpdate (inputData) {
		OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSaveThrottleMap, inputData.XYZDocumentID, {
			OLSKThrottleDuration: 250,
			async OLSKThrottleCallback () {
				mod._ValueZDRWrap.App.XYZDocument.XYZDocumentUpdate(Object.assign(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected(), {
					XYZDocumentModificationDate: new Date(),
				}));
			},
		});
	},

	ControlItemDiscard (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogRemove(inputData);

		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(null);

		mod._ValueZDRWrap.App.XYZDocument.ZDRModelDeleteObject(inputData);

		mod._OLSKCatalog.modPublic.OLSKCatalogFocusMaster(); // #purge-not-focusing
	},

	ControlItemSelect (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(inputData);

		mod._OLSKCatalog.modPublic.OLSKCatalogFocusDetail();

		setTimeout(mod.ControlFocusDetail);
	},

	ControlFocusDetail() {
		document.querySelector('.TestItemField').focus();
	},

	// MESSAGE

	OLSKCatalogDispatchClick (inputData) {
		mod.ControlItemSelect(inputData);
	},

	OLSKCatalogDispatchArrow (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(inputData);
	},

	OLSKCatalogSortFunction (a, b) {
		return (function(e) {
			return uDescending(a[e], b[e]);
		})(['XYZDocumentModificationDate', 'XYZDocumentCreationDate'].filter(function (e) {
			return a[e] && b[e];
		}).shift());
	},

	OLSKCatalogIsMatch (item, text) {
		return item.XYZDocumentName.match(text);
	},

	OLSKCatalogExactSortFunction (needle, a, b) {
		return uDescending(a.XYZDocumentName.startsWith(needle), b.XYZDocumentName.startsWith(needle));
	},

	_OLSKCatalogDispatchKey (inputData) {
		return inputData.XYZDocumentID;
	},

	OLSKAppToolbarDispatchCloud () {
		mod._ValueCloudToolbarHidden = !mod._ValueCloudToolbarHidden;
	},

	OLSKAppToolbarDispatchLauncher () {
		if (window.Launchlet.LCHSingletonExists()) {
			return window.Launchlet.LCHSingletonDestroy();
		}

		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: mod.DataRecipes(),
		});
	},

	OLSKCloudDispatchRenew () {
		mod._ValueZDRWrap.ZDRCloudReconnect(mod._ValueCloudIdentity);
	},

	async OLSKCloudFormDispatchSubmit (inputData) {
		const protocol = zerodatawrap.ZDRPreferenceProtocolConnect(inputData);
		(zerodatawrap.ZDRPreferenceProtocolMigrate() ? await mod.DataStorageClient(protocol) : mod._ValueZDRWrap).ZDRCloudConnect(inputData);
	},

	OLSKCloudStatusDispatchSyncStart () {
		mod._ValueIsSyncing = true;

		mod._ValueOLSKRemoteStorage.startSync();
	},

	OLSKCloudStatusDispatchSyncStop () {
		mod._ValueOLSKRemoteStorage.stopSync();
	},

	OLSKCloudStatusDispatchDisconnect () {
		mod._ValueZDRWrap.ZDRCloudDisconnect();

		mod._ValueCloudIdentity = null;

		zerodatawrap.ZDRPreferenceProtocolClear();
	},

	ZDRParamDispatchError (error) {
		mod._ValueCloudErrorText = error.toString();
	},

	ZDRParamDispatchConnected (identity) {
		mod._ValueCloudIdentity = identity;
	},

	ZDRParamDispatchOnline () {
		mod._ValueCloudIsOffline = false;
	},

	ZDRParamDispatchOffline () {
		mod._ValueCloudIsOffline = true;
	},

	ZDRSchemaDispatchSyncConflict (event) {
		setTimeout(async function () {
			console.log(await mod._ValueZDRWrap.App.XYZDocument.XYZDocumentCreate(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(event.oldValue)));
		}, 500);
	},

	ZDRParamDispatchError (error) {
		mod._ValueCloudErrorText = error.message;
	},

	// SETUP

	// _SetupMethods () {
	// 	return Object.keys(mod).filter(function (e) {
	// 		return e.match(/^Setup/);
	// 	});
	// },

	async SetupEverything () {
		try {
			await mod.SetupStorageClient();
			await mod.SetupCatalog();
		} catch (error) {
			console.error(error);
		}
	},

	DataStorageClient (inputData) {
		const tree = JSON.parse(localStorage.getItem('XYZ_TREE')) || {};

		return zerodatawrap.ZDRWrap({
			ZDRParamLibrary: (function() {
				if (inputData === zerodatawrap.ZDRProtocolFission()) {
					return webnative;
				}

				if (inputData === zerodatawrap.ZDRProtocolRemoteStorage()) {
					return RemoteStorage;
				}

				return {
					ZDRClientWriteFile (param1, param2) {
						localStorage.setItem('XYZ_TREE', JSON.stringify(Object.assign(tree, {
							[param1]: param2,
						})))
					},
					ZDRClientReadFile (inputData) {
						return tree[inputData];
					},
					ZDRClientListObjects () {
						return Object.entries(tree).reduce(function (coll, [key, value]) {
							return Object.assign(coll, {
								[key]: JSON.parse(value),
							});
						}, {});
					},
					ZDRClientDelete (inputData) {
						delete tree[inputData];

						localStorage.setItem('XYZ_TREE', JSON.stringify(tree))
					},
				};
			})(),
			ZDRParamScopes: [{
				ZDRScopeKey: 'App',
				ZDRScopeDirectory,
				ZDRScopeSchemas: [Object.assign(XYZDocument, {
					ZDRSchemaDispatchSyncCreate: mod._OLSKCatalog.modPublic.OLSKCatalogInsert,
					ZDRSchemaDispatchSyncUpdate: mod._OLSKCatalog.modPublic.OLSKCatalogUpdate,
					ZDRSchemaDispatchSyncDelete: mod._OLSKCatalog.modPublic.OLSKCatalogRemove,
					ZDRSchemaDispatchSyncConflict: mod.ZDRSchemaDispatchSyncConflict,
				})],
			}],
			ZDRParamDispatchError: mod.ZDRParamDispatchError,
			ZDRParamDispatchConnected: mod.ZDRParamDispatchConnected,
			ZDRParamDispatchOnline: mod.ZDRParamDispatchOnline,
			ZDRParamDispatchOffline: mod.ZDRParamDispatchOffline,
			_ZDRParamDispatchJSONPreStringify: OLSKObject.OLSKObjectSafeCopy,
			_ZDRParamDispatchJSONPostParse: OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse,
		});
	},

	async SetupStorageClient () {
		mod._ValueZDRWrap = await mod.DataStorageClient(zerodatawrap.ZDRPreferenceProtocol(zerodatawrap.ZDRProtocolCustom()));
	},

	async SetupCatalog() {
		if (zerodatawrap.ZDRPreferenceProtocolMigrate()) {
			const client = await mod.DataStorageClient(zerodatawrap.ZDRPreferenceProtocolMigrate());
			
			await Promise.all(Object.entries(await client.App.ZDRStorageListingObjects('')).map(async function ([key, value]) {
				await mod._ValueZDRWrap.App.ZDRStorageWriteObject(key, value);
				await client.App.ZDRStorageDeleteFile(key);
			}));

			zerodatawrap.ZDRPreferenceProtocolMigrateClear();

			client.ZDRCloudDisconnect();
		};

    (await mod._ValueZDRWrap.App.XYZDocument.XYZDocumentList()).map(mod._OLSKCatalog.modPublic.OLSKCatalogInsert);
	},

	// LIFECYCLE

	LifecycleModuleWillMount () {
		mod.SetupEverything();
		// return uSerial(mod._SetupMethods().map(function (e) {
		// 	return Promise.resolve(mod[e]());
		// }));
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleModuleWillMount);

const inputData = Object.assign({
	OLSKCollectionItemAccessibilitySummaryFunction (inputData) {
		return inputData.XYZDocumentName;
	},
}, Array.from((new window.URLSearchParams(window.location.search)).entries()));

import OLSKCatalog from 'OLSKCatalog';
import OLSKAppToolbar from 'OLSKAppToolbar';
import OLSKCloud from 'OLSKCloud';
import OLSKServiceWorkerView from './node_modules/OLSKServiceWorker/main.svelte';
import _OLSKSharedCreate from './node_modules/OLSKUIAssets/_OLSKSharedCreate.svg';
import _OLSKSharedBack from './node_modules/OLSKUIAssets/_OLSKSharedBack.svg';
import _OLSKSharedDiscard from './node_modules/OLSKUIAssets/_OLSKSharedDiscard.svg';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown } />

<div class="OLSKViewport">

<div class="OLSKViewportContent">

<OLSKCatalog
	bind:this={ mod._OLSKCatalog }

	OLSKCatalogDispatchClick={ mod.OLSKCatalogDispatchClick }
	OLSKCatalogDispatchArrow={ mod.OLSKCatalogDispatchArrow }
	
	OLSKCatalogSortFunction={ mod.OLSKCatalogSortFunction }
	OLSKCatalogIsMatch={ mod.OLSKCatalogIsMatch }
	OLSKCatalogExactSortFunction={ mod.OLSKCatalogExactSortFunction }

	_OLSKCatalogDispatchKey={ mod._OLSKCatalogDispatchKey }

	{ ...inputData }

	let:OLSKResultsListItem
	>

	<!-- MASTER -->

	<div class="OLSKToolbarElementGroup" slot="OLSKMasterListToolbarTail">
		<div>
			<button class="TestItemCreateButton OLSKDecorButtonNoStyle OLSKDecorTappable OLSKToolbarButton"on:click={ mod.InterfaceCreateButtonDidClick } accesskey="n">
				<div>{@html _OLSKSharedCreate }</div>
			</button>
		</div>
	</div>
	
	<div class="XYZListItem" slot="OLSKCollectionItem">{ OLSKResultsListItem.XYZDocumentName || OLSKResultsListItem.XYZDocumentID }</div>
	
	<!-- DETAIL -->
	
	<div class="TestDetail" slot="OLSKCatalogDetailContent" let:OLSKCatalogItemSelected>
	
	<header class="OLSKToolbar OLSKToolbarJustify OLSKCommonEdgeBottom">
		<div class="OLSKToolbarElementGroup"></div>
		<div class="OLSKToolbarElementGroup">
			<button class="TestItemDiscardButton OLSKDecorButtonNoStyle OLSKDecorTappable OLSKToolbarButton"on:click={ mod.InterfaceDiscardButtonDidClick }>
				<div>{@html _OLSKSharedDiscard }</div>
			</button>
		</div>
	</header>

	<div class="TestForm OLSKDecor">
		<textarea class="TestItemField" on:input={ mod.InterfaceFieldDidInput } placeholder="Content">{ OLSKCatalogItemSelected.XYZDocumentName }</textarea>
	</div>
	
	</div>
</OLSKCatalog>

</div>

<footer class="TestViewportFooter OLSKMobileViewFooter">
	{#if !mod._ValueCloudToolbarHidden }
		<div class="TestCloudToolbar OLSKToolbar OLSKToolbarJustify OLSKCommonEdgeTop">
			<div class="OLSKToolbarElementGroup">
			</div>

			<div class="OLSKToolbarElementGroup">
				<OLSKCloud
					OLSKCloudErrorText={ mod._ValueCloudErrorText }
					OLSKCloudDispatchRenew={ mod.OLSKCloudDispatchRenew }
					OLSKCloudFormDispatchSubmit={ mod.OLSKCloudFormDispatchSubmit }
					OLSKCloudStatusIdentityText={ mod._ValueCloudIdentity }
					OLSKCloudStatusIsSyncing={ mod._ValueIsSyncing }
					OLSKCloudStatusDispatchSyncStart={ mod.OLSKCloudStatusDispatchSyncStart }
					OLSKCloudStatusDispatchSyncStop={ mod.OLSKCloudStatusDispatchSyncStop }
					OLSKCloudStatusDispatchDisconnect={ mod.OLSKCloudStatusDispatchDisconnect }
					/>
			</div>
		</div>
	{/if}

	<OLSKAppToolbar
		OLSKAppToolbarCloudConnected={ !!mod._ValueCloudIdentity }
		OLSKAppToolbarCloudOffline={ mod._ValueCloudIsOffline }
		OLSKAppToolbarCloudError={ !!mod._ValueCloudErrorText }
		OLSKAppToolbarDispatchCloud={ mod.OLSKAppToolbarDispatchCloud }
		OLSKAppToolbarDispatchLauncher={ mod.OLSKAppToolbarDispatchLauncher }
		/>

	<OLSKServiceWorkerView OLSKServiceWorkerRegistrationRoute={ window.OLSKCanonical('FissionProofServiceWorkerRoute') } />
</footer>

</div>

<style>
:root {
	font-size: 9pt;
	font-family: 'Helvetica';
}

:global(.OLSKCollectionItem) {
	border-bottom: var(--OLSKCommonEdgeBorder);
}

.XYZListItem {
	display: inline-block;
	padding: 8px;
}

.TestDetail, .TestForm, .TestItemField {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.TestItemField {
	border: none;
}
</style>

<script>
import OLSKRemoteStorage from 'OLSKRemoteStorage';
import OLSKObject from 'OLSKObject';
import XYZDocument from './_shared/XYZDocument/main.js';
import OLSKThrottle from 'OLSKThrottle';
import OLSKLocalStorage from 'OLSKLocalStorage';
import OLSKServiceWorker from 'OLSKServiceWorker';
import zerodatawrap from 'zerodatawrap';
import remoteStorage from 'remotestoragejs';

import { OLSKLocalized } from 'OLSKInternational';
import { OLSK_SPEC_UI } from 'OLSKSpec';

const ZDRScopeDirectory = 'todos';

const uDescending = function (a, b) {
  return (a > b) ? -1 : ((a < b) ? 1 : 0);
};

const mod = {

	// VALUE

	_ValueSaveThrottleMap: {},

	_ValueCloudToolbarHidden: true,

	// DATA

	DataItemValid () {
		return {
			description: '',
			// non-storage
			$XYZDocumentID: Date.now().toString(),
		};
	},

	DataNavigator () {
		return navigator.serviceWorker ? navigator : {
			serviceWorker: {},
		};
	},

	DataRecipes () {
		const items = [];

		items.push(...OLSKServiceWorker.OLSKServiceWorkerRecipes(window, mod.DataNavigator(), OLSKLocalized, OLSK_SPEC_UI()));

		if (mod._ValueZDRWrap.ZDRStorageProtocol === zerodatawrap.ZDRProtocolRemoteStorage()) {
			items.push(...OLSKRemoteStorage.OLSKRemoteStorageRecipes({
				ParamStorage: mod._ValueZDRWrap.ZDRStorageClient(),
				OLSKLocalized,
				ParamMod: mod,
				ParamSpecUI: OLSK_SPEC_UI(),
			}));
		}
	
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
		mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected().description = this.value;

		mod.ControlItemUpdate(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());

		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	InterfaceWindowDidKeydown (event) {
		if (document.querySelector('.LCHLauncher')) { // #spec
			return;
		}

		const handlerFunctions = {

			Tab () {
				document.activeElement !== document.querySelector('.OLSKNarrowFilterField') ? mod._OLSKCatalog.modPublic.OLSKCatalogFocusMaster() : mod.ControlFocusDetail();

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
		OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSaveThrottleMap, inputData.$XYZDocumentID, {
			OLSKThrottleDuration: 250,
			async OLSKThrottleCallback () {
				mod._ValueZDRWrap.App.XYZDocument.XYZDocumentUpdate(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
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

		setTimeout(mod.ControlFocusDetail, 100);
	},

	ControlFocusDetail() {
		document.querySelector('.TestItemField').focus();
	},

	// MESSAGE

	OLSKCollectionDispatchClick (inputData) {
		mod.ControlItemSelect(inputData);
	},

	OLSKCollectionDispatchArrow (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(inputData);
	},

	OLSKCatalogSortFunction (a, b) {
		return (function(e) {
			return uDescending(a[e], b[e]);
		})(['$XYZDocumentID'].filter(function (e) {
			return a[e] && b[e];
		}).shift());
	},

	OLSKCatalogIsMatch (item, text) {
		return item.description.match(text);
	},

	OLSKCatalogExactSortFunction (needle, a, b) {
		return uDescending(a.description.startsWith(needle), b.description.startsWith(needle));
	},

	_OLSKCatalogDispatchKey (inputData) {
		return inputData.$XYZDocumentID;
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
		if (mod._ValueZDRWrap.ZDRStorageProtocol !== zerodatawrap.ZDRProtocolRemoteStorage()) {
			return;
		}

		mod._ValueZDRWrap.ZDRStorageClient().startSync();
	},

	OLSKCloudStatusDispatchSyncStop () {
		if (mod._ValueZDRWrap.ZDRStorageProtocol !== zerodatawrap.ZDRProtocolRemoteStorage()) {
			return;
		}

		mod._ValueZDRWrap.ZDRStorageClient().stopSync();
	},

	OLSKCloudStatusDispatchDisconnect () {
		mod._ValueZDRWrap.ZDRCloudDisconnect();

		mod._ValueCloudIdentity = null;

		zerodatawrap.ZDRPreferenceProtocolClear();

		localStorage.clear();
	},

	ZDRParamDispatchError (error) {
		mod._ValueCloudErrorText = error.message;
	},

	ZDRParamDispatchWriteError (error) {
		window.alert(mod._OLSKAppToolbarErrorText = error.message);
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

	ZDRParamDispatchSyncDidStart () {
		mod._ValueIsSyncing = true;
	},

	ZDRParamDispatchSyncDidStop () {
		mod._ValueIsSyncing = false;
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

	async SetupEverything () {
		try {
			await mod.SetupStorageClient();
			await mod.SetupCatalog();
		} catch (error) {
			console.error(error);
		}
	},

	DataStorageClient (inputData) {
		const tree = OLSKLocalStorage.OLKSLocalStorageGet(localStorage, 'XYZ_TREE') || {};

		return zerodatawrap.ZDRWrap({
			ZDRParamLibrary: (function() {
				return remoteStorage;
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
			ZDRParamDispatchWriteError: mod.ZDRParamDispatchWriteError,
			ZDRParamDispatchConnected: mod.ZDRParamDispatchConnected,
			ZDRParamDispatchOnline: mod.ZDRParamDispatchOnline,
			ZDRParamDispatchOffline: mod.ZDRParamDispatchOffline,
			_ZDRParamDispatchJSONPreStringify: OLSKObject.OLSKObjectSafeCopy,
			_ZDRParamDispatchJSONPostParse: OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse,
		});
	},

	async SetupStorageClient () {
		mod._ValueZDRWrap = await mod.DataStorageClient(zerodatawrap.ZDRPreferenceProtocol(zerodatawrap.ZDRProtocolRemoteStorage()));
	},

	async SetupCatalog() {
		if (zerodatawrap.ZDRPreferenceProtocolMigrate()) {
			const client = await mod.DataStorageClient(zerodatawrap.ZDRPreferenceProtocolMigrate());
			
			await Promise.all(Object.entries(await client.App.ZDRStorageListingObjects('')).map(async function ([key, value]) {
				await mod._ValueZDRWrap.App.ZDRStorageWriteObject(key, JSON.parse(value));
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
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleModuleWillMount);

const inputData = Object.assign({
	OLSKCollectionItemAccessibilitySummaryFunction (inputData) {
		return inputData.description;
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

	OLSKCollectionDispatchClick={ mod.OLSKCollectionDispatchClick }
	OLSKCollectionDispatchArrow={ mod.OLSKCollectionDispatchArrow }
	
	OLSKCatalogSortFunction={ mod.OLSKCatalogSortFunction }
	OLSKCatalogIsMatch={ mod.OLSKCatalogIsMatch }
	OLSKCatalogExactSortFunction={ mod.OLSKCatalogExactSortFunction }

	_OLSKCatalogDispatchKey={ mod._OLSKCatalogDispatchKey }

	{ ...inputData }

	let:OLSKCollectionItem
	>

	<!-- MASTER -->

	<div class="OLSKToolbarElementGroup" slot="OLSKNarrowToolbarTail">
		<div>
			<button class="TestItemCreateButton OLSKDecorButtonNoStyle OLSKDecorTappable OLSKToolbarButton"on:click={ mod.InterfaceCreateButtonDidClick } accesskey="n">
				<div>{@html _OLSKSharedCreate }</div>
			</button>
		</div>
	</div>
	
	<div class="XYZListItem" slot="OLSKCollectionItem">{ OLSKCollectionItem.description || OLSKCollectionItem.$XYZDocumentID }</div>
	
	<!-- DETAIL -->
	
	<div class="TestDetail" slot="OLSKCatalogDetailContent" let:OLSKCatalogItemSelected>
	
	<header class="OLSKToolbar OLSKToolbarJustify OLSKCommonEdgeBottom">
		<div class="OLSKToolbarElementGroup">
			<button class="TestDetailToolbarBackButton OLSKDecorButtonNoStyle OLSKDecorTappable OLSKToolbarButton OLSKVisibilityMobile" title={ OLSKLocalized('TestDetailToolbarBackButtonText') } on:click={ mod.InterfaceBackButtonDidClick }>
				<div class="TestDetailToolbarBackButtonImage">{@html _OLSKSharedBack }</div>
			</button>
		</div>
		<div class="OLSKToolbarElementGroup">
			<button class="TestItemDiscardButton OLSKDecorButtonNoStyle OLSKDecorTappable OLSKToolbarButton"on:click={ mod.InterfaceDiscardButtonDidClick }>
				<div>{@html _OLSKSharedDiscard }</div>
			</button>
		</div>
	</header>

	<div class="TestForm OLSKDecor">
		<textarea class="TestItemField" on:input={ mod.InterfaceFieldDidInput } placeholder="Content">{ OLSKCatalogItemSelected.description }</textarea>
		<hr>
		<pre>{ JSON.stringify(OLSKCatalogItemSelected, null, ' ') }</pre>
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
		OLSKAppToolbarErrorText={ mod._OLSKAppToolbarErrorText }
		OLSKAppToolbarCloudConnected={ !!mod._ValueCloudIdentity }
		OLSKAppToolbarCloudOffline={ mod._ValueCloudIsOffline }
		OLSKAppToolbarCloudError={ !!mod._ValueCloudErrorText }
		OLSKAppToolbarDispatchCloud={ mod.OLSKAppToolbarDispatchCloud }
		OLSKAppToolbarDispatchLauncher={ mod.OLSKAppToolbarDispatchLauncher }>
		<a class="RepoLink OLSKDecorPress OLSKDecorPressCall" href={ 'XYZ_REPO_URL_SWAP_TOKEN' } target="_blank">
			<small>Repo</small>
		</a>
	</OLSKAppToolbar>

	<OLSKServiceWorkerView OLSKServiceWorkerRegistrationRoute={ window.OLSKCanonical('ZeroDataProofServiceWorkerRoute') } />
</footer>

</div>

<style>
:root {
	font-size: 9pt;
	font-family: 'Helvetica';
	--OLSKDecorBackgroundDeep: #eee;
	--OLSKDecorBackgroundDeepEdge: var(--OLSKDecorForegroundLight);
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

	resize: none;
}

.TestItemField {
	border: none;
}

.RepoLink {
	border-width: 1px !important;
	font-weight: normal;
	padding: 8px 5px;
	position: relative;
	left: 24px;
}
</style>

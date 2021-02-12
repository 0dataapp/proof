<script>
import XYZ_Data from './_shared/XYZ_Data/main.js';
import XYZDocumentStorage from './_shared/XYZDocument/storage.js';
import RemoteStorage from 'remotestoragejs';
import OLSKRemoteStorage from 'OLSKRemoteStorage'
import XYZDocumentAction from './_shared/XYZDocument/action.js';
import OLSKThrottle from 'OLSKThrottle';
import OLSKCrypto from 'OLSKCrypto';
import OLSKLocalStorage from 'OLSKLocalStorage';
const wn = webnative;

import { OLSKLocalized } from 'OLSKInternational';

const uSerial = function (inputData) {
	return inputData.reduce(async function (coll, item) {
		return item.then(Array.prototype.concat.bind(await coll));
	}, Promise.resolve([]));
};

const mod = {

	// VALUE

	_ValueSaveThrottleMap: {},

	_ValueStorageToolbarHidden: true,

	_ValueFooterStorageStatus: '',

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

		// items.push(...OLSKRemoteStorage.OLSKRemoteStorageRecipes({
		// 	ParamWindow: window,
		// 	ParamStorage: mod._ValueOLSKRemoteStorage,
		// 	OLSKLocalized: OLSKLocalized,
		// 	ParamMod: mod,
		// 	ParamSpecUI: false,
		// }).concat(mod._OLSKPasscode.modPublic.OLSKPasscodeRecipes({
		// 	ParamMod: mod,
		// 	ParamSpecUI: false,
		// 	OLSKLocalized,
		// })));
	
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
		const item = mod.DataItemValid();

		OLSKLocalStorage.OLKSLocalStorageGet(localStorage, 'XYZ_DID_AUTHENTICATE') ? mod._ValueWNFSWrite(item) : OLSKLocalStorage.OLKSLocalStorageSet(localStorage, 'XYZ_ITEMS', mod._OLSKCatalog.modPublic.OLSKCatalogDataItemsAll().concat(item));

		// mod.ControlItemSelect(mod._OLSKCatalog.modPublic.OLSKCatalogInsert(await XYZDocumentAction.XYZDocumentActionCreate(mod._ValueOLSKRemoteStorage, mod.DataItemValid())));

		mod.ControlItemSelect(mod._OLSKCatalog.modPublic.OLSKCatalogInsert(item));
	},

	ControlItemUpdate (inputData) {
		OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSaveThrottleMap, inputData.XYZDocumentID, {
			OLSKThrottleDuration: 250,
			async OLSKThrottleCallback () {
				const item = Object.assign(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected(), {
					XYZDocumentModificationDate: new Date(),
				});

				OLSKLocalStorage.OLKSLocalStorageGet(localStorage, 'XYZ_DID_AUTHENTICATE') ? mod._ValueWNFSWrite(item) : OLSKLocalStorage.OLKSLocalStorageSet(localStorage, 'XYZ_ITEMS', mod._OLSKCatalog.modPublic.OLSKCatalogDataItemsAll());

				// await XYZDocumentAction.XYZDocumentActionUpdate(mod._ValueOLSKRemoteStorage, inputData);
			},
		});
	},

	ControlItemDiscard (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogRemove(inputData);

		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(null);

		OLSKLocalStorage.OLKSLocalStorageGet(localStorage, 'XYZ_DID_AUTHENTICATE') ? mod._ValueWNFSDelete(inputData) : OLSKLocalStorage.OLKSLocalStorageSet(localStorage, 'XYZ_ITEMS', mod._OLSKCatalog.modPublic.OLSKCatalogDataItemsAll());

		// XYZDocumentAction.XYZDocumentActionDelete(mod._ValueOLSKRemoteStorage, inputData);

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

	ControlAuthenticate () {
		OLSKLocalStorage.OLKSLocalStorageSet(localStorage, 'XYZ_DID_AUTHENTICATE', true);

		mod.SetupStorageClient();
	},

	// MESSAGE

	OLSKCatalogDispatchClick (inputData) {
		mod.ControlItemSelect(inputData);
	},

	OLSKCatalogDispatchArrow (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(inputData);
	},

	OLSKCatalogDispatchSort (a, b) {
		return b.XYZDocumentModificationDate - a.XYZDocumentModificationDate;
	},

	OLSKCatalogDispatchFilter (item, text) {
		return item.XYZDocumentName.match(text);
	},

	OLSKCatalogDispatchExact (item, text) {
		return item.XYZDocumentName.startsWith(text);
	},

	_OLSKCatalogDispatchKey (inputData) {
		return inputData.XYZDocumentID;
	},

	OLSKAppToolbarDispatchStorage () {
		mod._ValueStorageToolbarHidden = !mod._ValueStorageToolbarHidden;
	},

	OLSKAppToolbarDispatchLauncher () {
		if (window.Launchlet.LCHSingletonExists()) {
			return window.Launchlet.LCHSingletonDestroy();
		}

		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: mod.DataRecipes(),
		});
	},

	OLSKPasscodeDispatchContinue () {},

	// SETUP

	_SetupMethods () {
		return Object.keys(mod).filter(function (e) {
			return e.match(/^Setup/);
		});
	},

	async SetupStorageClient () {
		if (!OLSKLocalStorage.OLKSLocalStorageGet(localStorage, 'XYZ_DID_AUTHENTICATE')) {
			return;
		}

		const state = await wn.initialise({
		  permissions: {
		    app: {
		      name: 'fission-proof',
		      creator: 'rosano.ca',
		    },

		    fs: {
		      privatePaths: [ 'Documents' ],
		    }
		  }
		});
		console.log('hello', OLSKLocalStorage.OLKSLocalStorageGet(localStorage, 'XYZ_DID_AUTHENTICATE'), state.scenario);

		switch (state.scenario) {
		  case wn.Scenario.AuthCancelled:
		    // User was redirected to lobby,
		    // but cancelled the authorisation
		    break;

		  case wn.Scenario.AuthSucceeded:
		  case wn.Scenario.Continuation:
		    mod._ValueWNFS = state.fs;
		    mod._ValueWNFSPath = function (inputData) {
		    	return mod._ValueWNFS.appPath() + '/' + inputData.XYZDocumentID;
		    };
		    mod._ValueWNFSWrite = async function (inputData) {
		    	await mod._ValueWNFS.write(mod._ValueWNFSPath(inputData), JSON.stringify(inputData));
		    	return mod._ValueWNFS.publish();
		    };
		    mod._ValueWNFSDelete = async function (inputData) {
		    	await mod._ValueWNFS.rm(mod._ValueWNFSPath(inputData));
		    	return mod._ValueWNFS.publish();
		    };

		    if (!await mod._ValueWNFS.exists(mod._ValueWNFS.appPath())) {
		      await mod._ValueWNFS.mkdir(mod._ValueWNFS.appPath())
		    }

		    if (OLSKLocalStorage.OLKSLocalStorageGet(localStorage, 'XYZ_ITEMS')) {
		    	console.log(await Promise.all(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(OLSKLocalStorage.OLKSLocalStorageGet(localStorage, 'XYZ_ITEMS')).map(mod._ValueWNFSWrite)));

		    	OLSKLocalStorage.OLKSLocalStorageSet(localStorage, 'XYZ_ITEMS', null)
		    };

		    await mod._ValueWNFS.publish();

	    	const links = Object.entries(await mod._ValueWNFS.ls(mod._ValueWNFS.appPath()));
	      console.log({
	      	links,
	      });

	      // working with links
	      const data = await Promise.all(links.map(([name, _]) => {
	        return mod._ValueWNFS.cat(`${ mod._ValueWNFS.appPath() }/${name}`)
	      }))

	      console.log({
	      	data,
	      });

	    	OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(data.map(JSON.parse)).map(mod._OLSKCatalog.modPublic.OLSKCatalogInsert);

		    break;

		  case wn.Scenario.NotAuthorised:
		    wn.redirectToLobby(state.permissions)
		    break;
		}

		// const storageModule = XYZ_Data.XYZ_DataModule([
		// 	Object.assign(XYZDocumentStorage.XYZDocumentStorageBuild, {
		// 		OLSKChangeDelegate: {
		// 			OLSKChangeDelegateCreate: mod._OLSKCatalog.modPublic.OLSKCatalogInsert,
		// 			OLSKChangeDelegateUpdate: mod._OLSKCatalog.modPublic.OLSKCatalogUpdate,
		// 			OLSKChangeDelegateDelete: mod._OLSKCatalog.modPublic.OLSKCatalogRemove,
		// 		},
		// 	}),
		// 	], {
		// });
		
		// mod._ValueOLSKRemoteStorage = new RemoteStorage({
		// 	modules: [ storageModule ],
		// });

		// const hash = window.localStorage.getItem('OLSK_PASSCODE_HASH');
		// if (hash) {
		// 	const functions = OLSKCrypto.OLSKCryptoAESFunctions(hash);

		// 	mod._ValueOLSKRemoteStorage.test_rs_encrypt.OLSKRemoteStorageEnableCrypto(functions.OLSKCryptoAESFunctionsEncrypt, functions.OLSKCryptoAESFunctionsDecrypt);
		// }

		// mod._ValueOLSKRemoteStorage.access.claim(storageModule.name, 'rw');

		// mod._ValueOLSKRemoteStorage.caching.enable(`/${ storageModule.name }/`);
	},

	SetupStorageStatus () {
		// OLSKRemoteStorage.OLSKRemoteStorageStatus(mod._ValueOLSKRemoteStorage, function (inputData) {
		// 	mod._ValueFooterStorageStatus = inputData;
		// }, OLSKLocalized);
	},

	StorageConnected () {
		mod._ValueStorageIsConnected = true;
	},

	StorageNotConnected () {},

	StorageSyncDone () {},

	SetupStorageNotifications () {
		// mod._ValueOLSKRemoteStorage.on('connected', mod.StorageConnected);

		// mod._ValueOLSKRemoteStorage.on('not-connected', mod.StorageNotConnected);

		// mod._ValueOLSKRemoteStorage.on('sync-done', mod.StorageSyncDone);

		// let isOffline;

		// mod._ValueOLSKRemoteStorage.on('network-offline', () => {
		// 	console.debug('network-offline', arguments);

		// 	isOffline = true;
		// });

		// mod._ValueOLSKRemoteStorage.on('network-online', () => {
		// 	console.debug('network-online', arguments);
			
		// 	isOffline = false;
		// });

		// mod._ValueOLSKRemoteStorage.on('error', (error) => {
		// 	if (isOffline && inputData.message === 'Sync failed: Network request failed.') {
		// 		return;
		// 	};

		// 	console.debug('error', error);
		// });

		// return new Promise(function (res, rej) {
		// 	return mod._ValueOLSKRemoteStorage.on('ready', res);
		// })
	},

	async SetupCatalog() {
		if (OLSKLocalStorage.OLKSLocalStorageGet(localStorage, 'XYZ_DID_AUTHENTICATE')) {
			return;
		}

		OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(OLSKLocalStorage.OLKSLocalStorageGet(localStorage, 'XYZ_ITEMS') || []).map(mod._OLSKCatalog.modPublic.OLSKCatalogInsert);

		return;
		(await XYZDocumentAction.XYZDocumentActionList(mod._ValueOLSKRemoteStorage)).map(mod._OLSKCatalog.modPublic.OLSKCatalogInsert);
	},

	// LIFECYCLE

	LifecycleModuleWillMount () {
		return uSerial(mod._SetupMethods().map(function (e) {
			return Promise.resolve(mod[e]());
		}));
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleModuleWillMount);

const inputData = Object.assign({
	OLSKCatalogItemAccessibilitySummaryFor (inputData) {
		return inputData.XYZDocumentName;
	},
}, Array.from((new window.URLSearchParams(window.location.search)).entries()));

import OLSKCatalog from 'OLSKCatalog';
import OLSKAppToolbar from 'OLSKAppToolbar';
import OLSKStorageWidget from 'OLSKStorageWidget';
import OLSKPasscode from 'OLSKPasscode';
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
	
	OLSKCatalogDispatchSort={ mod.OLSKCatalogDispatchSort }
	OLSKCatalogDispatchFilter={ mod.OLSKCatalogDispatchFilter }
	OLSKCatalogDispatchExact={ mod.OLSKCatalogDispatchExact }

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
	
	<div class="XYZListItem" slot="OLSKMasterListItem">{ OLSKResultsListItem.XYZDocumentName || OLSKResultsListItem.XYZDocumentID }</div>
	
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
	{#if !mod._ValueStorageToolbarHidden }
		<div class="TestStorageToolbar OLSKToolbar OLSKToolbarJustify OLSKCommonEdgeTop OLSKStorageToolbar">
			<div class="OLSKToolbarElementGroup">
			</div>

			<div class="OLSKToolbarElementGroup">
				<button on:click={ mod.InterfaceAuthenticateButtonDidClick }>Authenticate</button>
				<!-- <OLSKStorageWidget StorageClient={ mod._ValueOLSKRemoteStorage } /> -->
			</div>
		</div>
	{/if}

	<OLSKAppToolbar
		OLSKAppToolbarStorageStatus={ mod._ValueFooterStorageStatus }
		OLSKAppToolbarDispatchStorage={ mod.OLSKAppToolbarDispatchStorage }
		OLSKAppToolbarDispatchLauncher={ mod.OLSKAppToolbarDispatchLauncher }
		/>
</footer>

</div>

<OLSKPasscode OLSKPasscodeDispatchContinue={ mod.OLSKPasscodeDispatchContinue } bind:this={ mod._OLSKPasscode } />

<style>
:root {
	font-size: 9pt;
	font-family: 'Helvetica';
}

:global(.OLSKMasterListItem) {
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

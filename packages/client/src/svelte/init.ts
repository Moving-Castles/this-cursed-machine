// import {
//     createComponentSystem,
//     createSyncProgressSystem,
// } from "@modules/systems"
import { setupPublicNetwork } from "@mud/setupPublicNetwork"
import { publicNetwork, initBlockListener } from "@modules/network"
import { entities } from "@modules/state/base/stores"
import { get } from "svelte/store"

import { initActionSequencer } from "@modules/action/actionSequencer"
import { initStateSimulator } from "@modules/state/resolver"
import { ENVIRONMENT } from "@mud/enums"


export async function initNetwork(environment: ENVIRONMENT) {
    // Write mud layer to svelte store
    const mudLayer = await setupPublicNetwork(environment)
    publicNetwork.set(mudLayer)

    // Modules responsible for sending transactions
    initActionSequencer()

    // Write block numbers to svelte store and alert on lost connection
    initBlockListener()

    const worker = new Worker(new URL('./dataProcessor.worker.js', import.meta.url), { type: 'module' });

    worker.onmessage = function (e) {
        const { entityID, propertyName, newValue } = e.data;

        entities.update(value => {
            if (value[entityID] === undefined) value[entityID] = {};
            if (newValue === undefined) {
                delete value[entityID][propertyName];
            } else {
                value[entityID][propertyName] = newValue;
            }
            return value;
        });
    };

    // Create systems to listen to changes to game-specific tables
    for (const componentKey of mudLayer.tableKeys) {
        createComponentSystem(worker, componentKey)
    }

    // Listen to changes to the SyncProgresscomponent
    // createSyncProgressSystem()

    // Simulate state changes
    initStateSimulator()
}

function createComponentSystem(worker, componentKey) {
    console.log('Component system initialized for:', componentKey);
    const networkComponents = get(publicNetwork).components;
    if (networkComponents[componentKey]) {
        networkComponents[componentKey].update$.subscribe((update) => {
            console.log('update', update);
            // Post each update to the worker along with the componentKey
            // worker.postMessage({ update, componentKey });
        });
    } else {
        console.error('Component key not found in network components:', componentKey);
    }
}
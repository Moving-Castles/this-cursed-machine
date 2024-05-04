import { setupPublicNetwork } from "@mud/setupPublicNetwork"
import {
    createComponentSystem,
    createSyncProgressSystem,
    // createInitialSyncSystem
} from "@modules/systems"
import { publicNetwork, initBlockListener } from "@modules/network"
import { ENVIRONMENT } from "@mud/enums"

import { initActionSequencer } from "@modules/action/actionSequencer"
import { initStateSimulator } from "@modules/state/resolver"

export async function initNetwork(environment: ENVIRONMENT) {
    // Write mud layer to svelte store
    const mudLayer = await setupPublicNetwork(environment)
    publicNetwork.set(mudLayer)

    // Modules responsible for sending transactions
    initActionSequencer()

    // Write block numbers to svelte store and alert on lost connection
    initBlockListener()

    // Create systems to listen to changes to game-specific tables
    for (const componentKey of mudLayer.tableKeys) {
        // createInitialSyncSystem(componentKey)
        createComponentSystem(componentKey)
    }

    // Listen to changes to the SyncProgresscomponent
    createSyncProgressSystem()

    // Simulate state changes
    initStateSimulator()
}
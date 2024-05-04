import { setupPublicNetwork } from "@mud/setupPublicNetwork"
import { createSyncProgressSystem } from "@modules/systems"
import { publicNetwork, initBlockListener } from "@modules/network"
import { ENVIRONMENT } from "@mud/enums"
import { initActionSequencer } from "@modules/action/actionSequencer"
import { initStateSimulator } from "@modules/state/resolver"

export async function initNetwork(environment: ENVIRONMENT) {
    // Write mud layer to svelte store
    const mudLayer = await setupPublicNetwork(environment)
    publicNetwork.set(mudLayer)

    // Listen to changes to the SyncProgresscomponent
    createSyncProgressSystem()

    // Modules responsible for sending transactions
    initActionSequencer()

    // Write block numbers to svelte store and alert on lost connection
    initBlockListener()

    // Simulate state changes
    initStateSimulator()
}
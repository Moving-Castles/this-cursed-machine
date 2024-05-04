import { get } from "svelte/store"
import { publicNetwork, ready, loadingMessage } from "@modules/network"
import { SyncStep } from "@latticexyz/store-sync"
import { initEntities } from "@modules/systems/initEntities"
import { createComponentSystem } from "@modules/systems/"

export function createSyncProgressSystem() {
  let subscription = get(publicNetwork).components.SyncProgress.update$.subscribe(
    update => {
      loadingMessage.set(String(update.value[0]?.percentage.toFixed(0)))
      if (update.value[0]?.step === SyncStep.LIVE) {

        // Data loaded from indexer
        // Set initial local state
        initEntities()

        // Create systems to listen to changes to game-specific tables
        for (const componentKey of get(publicNetwork).tableKeys) {
          createComponentSystem(componentKey)
        }

        ready.set(true)

        subscription.unsubscribe()
      }
    }
  )
}

import { get } from "svelte/store"
import { publicNetwork, ready, loadingMessage } from "@modules/network"
import { SyncStep } from "@latticexyz/store-sync"
// import { createComponentSystem } from "@modules/systems/"

export function createSyncProgressSystem() {
  let subscription = get(publicNetwork).components.SyncProgress.update$.subscribe(
    update => {
      loadingMessage.set(String(update.value[0]?.percentage.toFixed(0)))
      if (update.value[0]?.step === SyncStep.LIVE) {

        // Data loaded from indexer
        ready.set(true)

        subscription.unsubscribe()
      }
    }
  )
}

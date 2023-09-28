import { get } from "svelte/store"
import { network, ready, loadingMessage } from "../network"
import { SyncStep } from "@latticexyz/store-sync"

export function createSyncProgressSystem() {
  let subscription = get(network).components.SyncProgress.update$.subscribe(
    update => {
      // console.log("==> SyncProgress system: ", update);
      loadingMessage.set(
        update.value[0]?.message + ": " + update.value[0]?.percentage.toFixed(2)
      )
      if (update.value[0]?.step === SyncStep.LIVE) {
        ready.set(true)
        subscription.unsubscribe()
      }
    }
  )
}

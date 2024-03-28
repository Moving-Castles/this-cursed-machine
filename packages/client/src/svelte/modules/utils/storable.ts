import { writable } from "svelte/store"

export function storableNumber(data) {
  const store = writable(data)
  const { subscribe, set, update } = store
  const isBrowser = () => typeof window !== "undefined"

  const init = () =>
    isBrowser() &&
    localStorage.getItem("storable") &&
    set(localStorage.getItem("storable"))

  // Update value when switching tabs
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      // Browser tab is hidden
    } else {
      // Browser tab is visible
      init()
    }
  })

  init()

  return {
    subscribe,
    set: n => {
      isBrowser() && localStorage.setItem("storable", String(n))
      set(n)
    },
    update: cb => {
      const updatedStore = cb(get(store))

      isBrowser() && localStorage.setItem("storable", String(updatedStore))

      set(updatedStore)
    },
  }
}

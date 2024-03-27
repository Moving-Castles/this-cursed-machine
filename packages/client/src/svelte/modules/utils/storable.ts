import { writable } from "svelte/store"

export function storableNumber(data) {
  const store = writable(data)
  const { subscribe, set, update } = store
  const isBrowser = () => typeof window !== "undefined"

  // Update value when switching tabs
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      // console.log("Browser tab is hidden")
    } else {
      // console.log("Browser tab is visible")

      isBrowser() &&
        localStorage.getItem("storable") &&
        set(localStorage.getItem("storable"))
    }
  })

  isBrowser() &&
    localStorage.getItem("storable") &&
    set(localStorage.getItem("storable"))

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

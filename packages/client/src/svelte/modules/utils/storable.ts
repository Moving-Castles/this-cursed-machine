import type { Writable } from "svelte/store"
import { writable, get } from "svelte/store"

function formatNumber(num: string | number) {
  // Example formatting: rounds the number to 2 decimal places
  return Number(num)
}

export function storableNumber(data, key): Writable<number> {
  const store = writable(data)
  const { subscribe, set } = store
  const isBrowser = () => typeof window !== "undefined"

  const init = () =>
    isBrowser() &&
    localStorage.getItem(key) &&
    set(formatNumber(localStorage.getItem(key)))

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
    subscribe: subscriber => {
      // Use the formatter function before passing the value to the subscriber
      return subscribe(value => subscriber(formatNumber(value)))
    },
    set: n => {
      isBrowser() && localStorage.setItem(key, String(n))
      set(formatNumber(n))
    },
    update: cb => {
      const updatedStore = cb(get(store))

      isBrowser() && localStorage.setItem(key, String(updatedStore))

      set(formatNumber(updatedStore))
    },
  }
}

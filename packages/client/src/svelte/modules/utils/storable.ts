import type { Writable } from "svelte/store"
import { writable, get } from "svelte/store"

function formatNumber(num: string | number) {
  return Number(num)
}

function formatArray(arr: any[] | string) {
  if (Array.isArray(arr)) return arr
  return JSON.stringify(arr)
}

const makeStorable = (data: any, key: string, type: "number" | "array") => {
  const store = writable(data)
  const { subscribe, set } = store
  const isBrowser = () => typeof window !== "undefined"

  const init = () => {
    if (isBrowser() && localStorage.getItem(key)) {
      if (type === "number") {
        set(formatNumber(localStorage.getItem(key)))
      }
      if (type === "array") {
        console.log(localStorage.getItem(key))
        set(localStorage.getItem(key))
      }
    }
  }

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
      return subscribe(value => {
        if (type === "number") {
          return subscriber(formatNumber(value))
        }
        if (type === "array") {
          return subscriber(formatArray(value))
        }
      })
    },
    set: n => {
      if (isBrowser()) {
        if (type === "number") {
          localStorage.setItem(key, String(n))
        }
        if (type === "array") {
          localStorage.setItem(key, JSON.stringify(n))
        }
      }
      if (type === "number") {
        set(formatNumber(n))
      }
      if (type === "array") {
        set(formatArray(n))
      }
    },
    update: cb => {
      const updatedStore = cb(get(store))

      isBrowser() && localStorage.setItem(key, String(updatedStore))

      if (type === "number") {
        set(formatNumber(updatedStore))
      }
      if (type === "array") {
        set(formatArray(updatedStore))
      }
    },
  }
}

export function storableNumber(data: number, key: string): Writable<number> {
  return makeStorable(data, key, "number")
}

export function storableArray(data: any[], key: string): Writable<any[]> {
  return makeStorable(data, key, "array")
}

import { tweened } from "svelte/motion"
import { readable } from "svelte/store"

// Utility to pad strings to a common length
const padStringToLength = (str, length) => str.padEnd(length, " ")

// Initializes a store for each character in the string
const initCharStores = (str, duration = 500) =>
  str.split("").map(char => tweened(char.charCodeAt(0), { duration }))

export const createTweenStore = duration => {
  let charStores = []
  let maxLen = 0

  const updateStores = newStr => {
    const paddedStr = padStringToLength(newStr, maxLen)
    paddedStr.split("").forEach((char, i) => {
      if (charStores[i]) {
        charStores[i].set(char.charCodeAt(0))
      } else {
        charStores.push(tweened(char.charCodeAt(0), { duration }))
      }
    })
  }

  const subscribe = listener => {
    const unsubscribeFunctions = charStores.map((store, i) =>
      store.subscribe(value => {
        listener(
          String.fromCharCode.apply(
            null,
            charStores.map(store => get(store))
          )
        )
      })
    )

    // Return an unsubscribe function to clean up listeners
    return () => unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
  }

  return {
    setStrings(strings) {
      maxLen = Math.max(...strings.map(str => str.length))
      // Initialize stores for the longest string to set up all needed character positions
      charStores = initCharStores(
        padStringToLength(strings[0], maxLen),
        duration
      )
      // Update stores for each string in sequence
      strings.forEach(str => updateStores(str))
    },
    subscribe: readable("", subscribe).subscribe,
  }
}

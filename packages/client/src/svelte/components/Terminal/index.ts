import { writable, get } from "svelte/store"

/**
 * Core >::)
 */
export const index = writable(-1)
export const output = writable([])
export const symbols = [
  "›",
  "»",
  "*",
  "+",
  "‡",
  "†",
  "+",
  "◊",
  "”",
  "%",
  "#",
  "«",
  "¥",
]

/**
 * REGEXES
 */
export const betweenSquareBrackets = /(?<=\[).+?(?=\])/g
export const betweenBrackets = /(?<=\().+?(?=\))/g
export const betweenCarets = /(?<=\>).+?(?=\<)/g

export const spanner = (string: string) => {
  return string
    .split("")
    .map(char => `<span>${char}</span>`)
    .join("")
}

/**
 * Returns a parsed string.
 *
 * Everything between brackets becomes an action based on the content of what's between those brackets
 * @param string
 * @returns
 */
export const parsed = (string: string) => {
  // console.log('parse: ', string)
  // Replace all actions
  const result = string
    .split("\n")
    .map(s => {
      return s.replaceAll(
        betweenCarets,
        match => `<span class="aim">${spanner(match)}</span>`
      )
    })
    .map(s => {
      return s.replaceAll(
        betweenSquareBrackets,
        match => `<span class="flash">${spanner(match)}</span>`
      )
    })
    .map(s => {
      return s.replaceAll(
        betweenBrackets,
        match => `<span class="race">${spanner(match)}</span>`
      )
    })
    .join("\n")

  return result
}

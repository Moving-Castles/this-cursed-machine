import { ethers } from "ethers"

export const toCamelCase = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

export function shortenAddress(s: string) {
  return s ? s.slice(0, 8) + "..." + s.slice(-8) : ""
}

export function addressToColor(address: string): string {
  if (!address || address.length < 6) return "#FF0000"
  // Take the last 6 characters of the hash
  address = address.slice(-6)
  // Prefix with '#' to create a valid hex color code
  return "#" + address
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getUniqueValues<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

export function filterObjectByKey(
  obj: { [key: string]: any },
  keysToKeep: string[]
): { [key: string]: any } {
  const filteredObj: { [key: string]: any } = {}

  keysToKeep.forEach(key => {
    if (obj.hasOwnProperty(key)) {
      filteredObj[key] = obj[key]
    }
  })

  return filteredObj
}

// Unpadded to padded
export function padAddress(address: string): string {
  // Make sure the address is valid
  ethers.utils.getAddress(address)
  // remove '0x' prefix, pad the address with leading zeros up to 64 characters, then add '0x' prefix back
  return "0x" + address.slice(2).padStart(64, "0")
}

export function getRandomElement<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export function pickByIndex<T>(array: T[], index: number): T {
  return array[array.length % (index + 1)]
}

/**
 * Filters an object to return only those key/value pairs where the value's
 * `metadata.tableName` starts with the specified namespace.
 *
 * @template T - Type of the value that should have an optional metadata property with an optional tableName string.
 *
 * @param {Record<string, T>} data - The data object to filter.
 * @param {string} namespace - The namespace to filter by.
 * @returns {Record<string, T>} - An object containing only the key/value pairs that match the filter condition.
 */
export function filterByNamespace<
  T extends { metadata?: { tableName?: string } },
>(data: Record<string, T>, namespace: string): Record<string, T> {
  return Object.entries(data)
    .filter(([_, value]) => {
      const tableName = value.metadata?.tableName
      if (!tableName) return false // Case: tableName doesn't exist
      const parts = tableName.split(":")
      return parts.length === 2 && parts[0] === namespace // Ensures format is "namespace:something"
    })
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value as T }), {})
}

export function isNumeric(str: any) {
  if (typeof str != "string") return false // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ) // ...and ensure strings of whitespace fail
}

export function hexToString(hex) {
  hex = hex.substring(2) // remove the '0x' part
  var string = ""

  while (hex.length % 4 != 0) {
    // we need it to be multiple of 4
    hex = "0" + hex
  }

  for (var i = 0; i < hex.length; i += 4) {
    string += String.fromCharCode(parseInt(hex.substring(i, i + 4), 16)) // get char from ascii code which goes from 0 to 65536
  }

  return string
}

export function stringToHex(string) {
  var hex = ""
  for (var i = 0; i < string.length; i++) {
    hex += ((i == 0 ? "" : "000") + string.charCodeAt(i).toString(16)).slice(-4) // get character ascii code and convert to hexa string, adding necessary 0s
  }

  return "0x" + hex.toUpperCase()
}

/**
 * Deeply clones a given object or array, creating a new instance without shared references.
 *
 * @param {T} obj - The object or array to be cloned.
 * @returns {T} A deeply cloned copy of the input.
 * @template T
 */
export function deepClone<T>(obj: T): T {
  // Handle primitives and null values directly.
  if (obj === null) return obj as any
  if (typeof obj !== "object") return obj

  // If the object is an array, create a new array and recursively clone each element.
  if (Array.isArray(obj)) {
    const copy: any[] = []
    for (let i = 0; i < (obj as any[]).length; i++) {
      copy[i] = deepClone((obj as any[])[i])
    }
    return copy as any
  }

  // If the object is a plain object, create a new object and recursively clone each property.
  const copy: { [key: string]: any } = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepClone((obj as { [key: string]: any })[key])
    }
  }
  return copy as T
}

/**
 * Ensure that a number is not negative.
 * If the input number is negative, the function returns 0; otherwise, it returns the input number.
 *
 * @param num - The number to cap at 0. If it is negative, the function returns 0.
 *
 * @returns A number which is either the input number (if it is non-negative) or 0 (if the input number is negative).
 */
export function capAtZero(num: number): number {
  // Ensure that the input is not negative
  return Math.max(0, num)
}

/**
 * Generate a unique identifier for a pair of `number` values.
 *
 * @notice This function uses the Cantor pairing function to produce a unique
 * identifier from two `number` values. The order of input values does not affect
 * the generated identifier, meaning that (a, b) will produce the same output
 * as (b, a). Note that the input values should represent valid `MATERIAL_TYPE`
 * enum values to ensure consistent behavior.
 *
 * @param a First `number` value representing a `MATERIAL_TYPE`.
 * @param b Second `number` value representing a `MATERIAL_TYPE`.
 * @returns A unique identifier derived from the inputs (a, b).
 */
export function getUniqueIdentifier(a: number, b: number): number {
  // Ensure a is always smaller than or equal to b
  if (a > b) {
    ;[a, b] = [b, a]
  }

  return ((a + b) * (a + b + 1)) / 2 + b
}

export const lerp = (x, y, a) => x * (1 - a) + y * a
export const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a))
export const invlerp = (x, y, a) => clamp((a - x) / (y - x))
export const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a))

export function stepsEasing(t: number, steps: number = 4, direction = "start") {
  // Normalize the input time.
  t = Math.min(Math.max(t, 0), 1)

  // Calculate the current step based on the direction.
  let progress
  if (direction === "start") {
    // If the direction is 'start', the change happens at the beginning of the step.
    progress = Math.floor(t * steps) / steps
  } else {
    // If the direction is 'end' (or not specified), the change happens at the end of the step.
    // Here we use `ceil` to ensure we move to the next step at the very end of the previous step.
    progress = Math.ceil(t * steps) / steps
    // This is to ensure we never exceed 1.
    progress = Math.min(progress, 1)
  }

  return progress
}

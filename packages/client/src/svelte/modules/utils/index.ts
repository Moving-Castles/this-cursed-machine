import { concat, keccak256 } from "viem"
import { BLOCKTIME } from "./constants"
import { ONE_UNIT } from "../ui/constants"

export function toCamelCase(s: string): string {
  return (
    s
      // Remove all underscores and hyphens and convert the following letter to uppercase
      .replace(/([-_][a-z])/gi, $1 =>
        $1.toUpperCase().replace("-", "").replace("_", "")
      )
      // Ensure the first character is in lowercase
      .replace(/^./, str => str.toLowerCase())
  )
}

export function shortenAddress(s: string) {
  return s ? s.slice(0, 4) + "..." + s.slice(-4) : ""
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

export function removePrivateKeys(
  obj: Record<string, any>
): Record<string, any> {
  let newObj: Record<string, any> = {}
  for (const key in obj) {
    if (!key.startsWith("__")) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

// Unpadded to padded
export function addressToId(address: string): string {
  if (!address) return "0x0"
  // remove '0x' prefix, pad the address with leading zeros up to 64 characters, then add '0x' prefix back
  return "0x" + address.slice(2).padStart(64, "0").toLowerCase()
}

// Padded to unpadded
export function idToAddress(paddedAddress: string): string {
  if (!paddedAddress) return "0x0"
  // remove '0x' prefix, remove leading zeros, then add '0x' prefix back
  return "0x" + paddedAddress.slice(2).replace(/^0+/, '');
}

export function getRandomElement<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export function pickByIndex<T>(array: T[], index: number): T {
  return array[array.length % (index + 1)]
}

export function hexToString(hex: string) {
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

export function stringToHex(string: string) {
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
export function deepClone2<T>(obj: T): T {
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
 * Deeply clones a given object or array, creating a new instance without shared references.
 *
 * @param {T} obj - The object or array to be cloned.
 * @returns {T} A deeply cloned copy of the input.
 * @template T
 */
export function deepClone<T>(obj: T): T {
  return structuredClone(obj) as T
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
 * Get id for a combination of 2 materials
 * @param a Material id
 * @param b Material id
 */
export function getMaterialCombinationId(a: MaterialId, b: MaterialId): string {
  // Always sort the ids in ascending order to make the combination order-agnostic
  if (a > b) {
    return keccak256(concat([b, a]))
  } else {
    return keccak256(concat([a, b]))
  }
}

export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a
export const clamp = (a: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, a))
export const invlerp = (x: number, y: number, a: number) =>
  clamp((a - x) / (y - x))
export const range = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  a: number
) => lerp(x2, y2, invlerp(x1, y1, a))

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

function blocksToSeconds(blocks: number) {
  return blocks * BLOCKTIME
}

export function blocksToReadableTime(blocks: number): string {
  const seconds = blocksToSeconds(blocks)

  // Calculate hours, minutes and seconds
  const hours: number = Math.floor(seconds / 3600)
  const minutes: number = Math.floor((seconds % 3600) / 60)
  const secs: number = seconds % 60

  // Pad minutes and seconds with leading zeros if needed
  const paddedMinutes: string = minutes < 10 ? `0${minutes}` : `${minutes}`
  const paddedSeconds: string = secs < 10 ? `0${secs}` : `${secs}`

  // Format the string
  const result: string = `${hours}:${paddedMinutes}:${paddedSeconds}`

  return result
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function timeSince(timestamp: number): string {
  const now = Date.now() // Current time in milliseconds
  const elapsed = now - timestamp // Elapsed time in milliseconds

  // Convert milliseconds to minutes, hours, and days
  const minutes = Math.floor(elapsed / 60000)
  const hours = Math.floor(elapsed / 3600000)
  const days = Math.floor(elapsed / 86400000)

  // Return the time in the largest appropriate unit
  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""}`
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  } else {
    return "now"
  }
}

export function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

// Scale down big ints to displayable numbers
export function displayAmount(amount: bigint | undefined) {
  if (amount === undefined) return 0
  if (amount === BigInt(0)) return 0
  return Number(amount / ONE_UNIT)
}
// Limitation: not usable with timezones
export const parseISODateTime = (datestring: string) => {
  var dt = datestring.split(/[: T-]/).map(parseFloat)
  const localDate = new Date(
    dt[0],
    dt[1] - 1,
    dt[2],
    dt[3] || 0,
    dt[4] || 0,
    dt[5] || 0,
    0
  )

  return localDate
}
export const padWithZero = (value: number) => {
  return value.toString().padStart(2, "0")
}

export function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-based in JavaScript
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

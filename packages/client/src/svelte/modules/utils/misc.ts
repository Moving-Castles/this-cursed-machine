import { ethers } from "ethers";

export const toCamelCase = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export function shortenAddress(s: string) {
  return s ? s.slice(0, 8) + "..." + s.slice(-8) : "";
}

export function addressToColor(address: string): string {
  if (!address || address.length < 6) return "#FF0000";
  // Take the last 6 characters of the hash
  address = address.slice(-6);
  // Prefix with '#' to create a valid hex color code
  return "#" + address;
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  ethers.utils.getAddress(address);
  // remove '0x' prefix, pad the address with leading zeros up to 64 characters, then add '0x' prefix back
  return '0x' + address.slice(2).padStart(64, '0');
}

export function getRandomElement<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function pickByIndex<T>(array: T[], index: number): T {
  console.log(array, index, array.length % (index + 1))
  return array[array.length % (index + 1)];
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
export function filterByNamespace<T extends { metadata?: { tableName?: string } }>(
  data: Record<string, T>,
  namespace: string
): Record<string, T> {
  return Object.entries(data)
    .filter(([_, value]) => {
      const tableName = value.metadata?.tableName;
      if (!tableName) return false; // Case: tableName doesn't exist
      const parts = tableName.split(":");
      return parts.length === 2 && parts[0] === namespace; // Ensures format is "namespace:something"
    })
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value as T }), {});
}

export function isNumeric(str: any) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function hexToString(hex) {
  hex = hex.substring(2) // remove the '0x' part
  var string = ""

  while (hex.length % 4 != 0) { // we need it to be multiple of 4
    hex =  "0" + hex;
  }

  for (var i = 0; i < hex.length; i+= 4){
    string += String.fromCharCode(parseInt(hex.substring(i,i + 4), 16)) // get char from ascii code which goes from 0 to 65536
  }

  return string;
}

export function stringToHex(string) {
  var hex = ""
  for (var i=0; i < string.length; i++) {
    hex += ( (i == 0 ? "" : "000") + string.charCodeAt(i).toString(16)).slice(-4) // get character ascii code and convert to hexa string, adding necessary 0s
  }

  return '0x' + hex.toUpperCase();
}  
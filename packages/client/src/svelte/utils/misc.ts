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
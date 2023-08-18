import { paths } from "../../state"
import { get } from "svelte/store"

/**
* Function that generates a SVG path string from an array of coordinates.
* @param {Coord[]} coords - An array of coordinate objects. Each object should have 'x' and 'y' properties.
* @return {string} A string representation of the SVG path.
*/
export const makeSvgPath = (coords: Coord[], offset: number) => {
 // Initialize an empty string to hold the SVG path.
 let string = ""

 const canAfford = (i: number) => true // free
 const makePart = (i: number) => {
    const totalPaths = get(paths)?.length
    let offsetX = offset * 10 - ((totalPaths / 2) * 10)
    let offsetY = offset * 10 - ((totalPaths / 2) * 10)
   // If it's the first coordinate, it is where the path starts.
   // We use 'M' (move to) followed by the coordinate to define the start point of the path.
   // We add 0.5 to center the path in the middle of the coordinate grid cell.
   if (i === 0) {
     string += `M${coords[i].x * 100 + 50 + offsetX} ${
       coords[i].y * 100 + 50 + offsetY
     }`
   } else {
     // For all other coordinates, we use 'L' (line to) followed by the coordinate to define a line from the current point to this coordinate.
     // We add 0.5 to center the path in the middle of the coordinate grid cell.
     string += `L${coords[i].x * 100 + 50 + offsetX} ${
       coords[i].y * 100 + 50 + offsetY
     }`
   }
 }

 // Check if the array of coordinates is not empty.
 if (coords.length > 0) {
   for (let i = 0; i < coords.length; i++) {
     makePart(i)
   }
 }
 // Return the SVG path string.
 return string
}

// Fixed length so we can animate
export const makePolyline = (coords: Coord[], offset: number) => {
  let string = ""
  let length = 20

  const makePart = (i: number) => {
    const totalPaths = get(paths)?.length
    let offsetX = offset * 10 - ((totalPaths / 2) * 10)
    let offsetY = offset * 10 - ((totalPaths / 2) * 10)
    if (i < coords.length) {
      string += `${coords[i].x * 100 + 50 + offsetX},${coords[i].y * 100 + 50 + offsetY} `
    } else {
      string += `${coords[coords.length - 1].x * 100 + 50 + offsetX},${coords[coords.length - 1].y * 100 + 50 + offsetY} `
    }
  }

  if (coords.length > 0) {
    for (let i = 0; i < length; i++) {
      makePart(i)
    }
  }

  return string
}

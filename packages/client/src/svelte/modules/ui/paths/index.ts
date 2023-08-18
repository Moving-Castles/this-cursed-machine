/**
* Function that generates a SVG path string from an array of coordinates.
* @param {Coord[]} coords - An array of coordinate objects. Each object should have 'x' and 'y' properties.
* @return {string} A string representation of the SVG path.
*/
export const makeSvgPath = (coords: Coord[]) => {
 // Initialize an empty string to hold the SVG path.
 let string = ""

 const canAfford = (i: number) => true // free
 const makePart = (i: number) => {
   let offsetX = 0
   let offsetY = 0
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

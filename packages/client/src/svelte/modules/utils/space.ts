import type { Coord } from "@latticexyz/utils";
import { AStarFinder, Grid } from 'pathfinding'
const finder = new AStarFinder()

export function directionalPathfindAStar(from: Coord, to: Coord, unavailableCoords: Coord[]) {

  const grid = new Grid(4, 4)
  
  unavailableCoords.forEach(coord => grid.setWalkableAt(coord.x, coord.y, false))

  const path = finder.findPath(from.x, from.y, to.x, to.y, grid)

  return path.map(([x, y]) => ({ x, y }))
}

/**
 * @param a Coordinate A
 * @param b Coordinate B
 * @returns Manhattan distance from A to B (https://xlinux.nist.gov/dads/HTML/manhattanDistance.html)
 */
export function manhattan(a: Coord, b: Coord) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * @param a Coordinate A
 * @param b Coordinate B
 * @returns Chebyshev distance from A to B (https://en.wikipedia.org/wiki/Chebyshev_distance)
 */
export function chebyshev(a: Coord, b: Coord) {
  return a && b ? Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)) : 9999;
}

/**
 * @param from Coordinate to start from (included in the path)
 * @param to Coordinate to go to (included in the path)
 * @returns Finds a path between the from and to coordinates, used in some cases when aStar fails
 */
export function directionalPathfind(from: Coord, to: Coord) {
  const path: Coord[] = [];
  const directionX = from.x < to.x ? 1 : -1;
  const directionY = from.y < to.y ? 1 : -1;

  for (let x = from.x + directionX; directionX * x <= directionX * to.x; x = x + directionX) {
    path.push({ x, y: from.y });
  }

  for (let y = from.y + directionY; directionY * y <= directionY * to.y; y = y + directionY) {
    path.push({ x: to.x, y });
  }

  return path;
}

export const isAdjacent = (from: Coord, to: Coord) => chebyshev(from, to) === 1;

export const isCoordinate = (a: any) => a.x && a.y
export const sameCoordinate = (a: Coord, b: Coord) => a.x === b.x && a.y === b.y

/**
 * Function to compute the shortest Manhattan path between two points in a grid, starting along the y-axis.
 * @param {Coord} start - The starting point, an object with 'x' and 'y' properties.
 * @param {Coord} end - The ending point, an object with 'x' and 'y' properties.
 * @return {Coord[]} An array of points (each an object with 'x' and 'y'), representing the path from start to end.
 */
export function manhattanPath(start: Coord, end: Coord): Coord[] {
  // Initialize an empty array to hold the path.
  const path: Coord[] = []

  // First, move along the y-axis. This loop will run in increasing order if start.y is less than end.y, otherwise it will run in decreasing order.
  // On each iteration, a new point is added to the path with the start's x value and the current y value.
  for (
    let y = start.y;
    start.y < end.y ? y <= end.y : y >= end.y;
    start.y < end.y ? y++ : y--
  ) {
    path.push({ x: start.x, y })
  }

  // After reaching the desired y coordinate, start moving along the x-axis. This loop will run in increasing order if start.x is less than end.x, otherwise it will run in decreasing order.
  // On each iteration, a new point is added to the path with the current x value and the end's y value (since we've already reached it in the y-axis).
  for (
    let x = start.x;
    start.x < end.x ? x <= end.x : x >= end.x;
    start.x < end.x ? x++ : x--
  ) {
    path.push({ x, y: end.y })
  }

  // Return the generated path.
  return path
}

export function aStarPath (start: Coord, end: Coord, ignore: Coord[] = []) {
  console.log(start, end, ignore)
  return directionalPathfindAStar(start, end, ignore)
}

export const getDirection = (from: Coord, to: Coord) => {
  if (to.x < from.x) return 'west'
  if (to.y < from.y) return 'north'
  if (to.x > from.x) return 'east'
  if (to.y > from.y) return 'south'

  return ''
}

export function initGrid (width: number, height: number) {
    // Create an empty array to hold the grid
    let grid = [] as GridTile[]

    // Loop through each row of the grid (represented by y)
    for (let y = 0; y < height; y++) {
      // Within each row, loop through each cell (represented by x)
      for (let x = 0; x < width; x++) {
        // Create a new GridTile object with a unique id and coordinates corresponding to its position
        const newGridTile: GridTile = {
          id: `${x}-${y}`,
          coordinates: { x: x, y: y },
        }

        // Add the new GridTile to the end of the grid array
        grid = [...grid, newGridTile]
      }
    }

    // Return the fully constructed grid
    return grid
  }

export const withinBounds = (coord: Coord, width: number, height: number) =>
  coord.x >= 0 &&
  coord.x < width &&
  coord.y >= 0 &&
  coord.y < height
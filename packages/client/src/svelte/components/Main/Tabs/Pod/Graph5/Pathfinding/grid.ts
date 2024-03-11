import { deepClone } from '@svelte/modules/utils'
import type { GridNode, Grid } from './types'

export function initializeGrid(width: number, height: number): Grid {
    const nodes: GridNode[][] = []
    for (let y = 0; y < height; y++) {
        nodes[y] = []
        for (let x = 0; x < width; x++) {
            nodes[y][x] = {
                x,
                y,
                walkable: true,
                cost: 1
            }
        }
    }
    return {
        width,
        height,
        nodes
    }
}

export function isInside(grid: Grid, x: number, y: number): boolean {
    return (x >= 0 && x < grid.width) && (y >= 0 && y < grid.height);
}

export function getNodeAt(grid: Grid, x: number, y: number): GridNode {
    return grid.nodes[y][x];
}

export function isWalkableAt(grid: Grid, x: number, y: number): boolean {
    return isInside(grid, x, y) && grid.nodes[y][x].walkable;
}

export function setWalkableAt(grid: Grid, x: number, y: number, walkable: boolean): Grid {
    // const newGrid = deepClone(grid)
    // newGrid.nodes[y][x].walkable = walkable
    // return newGrid
    grid.nodes[y][x].walkable = walkable
    return grid
}

export function getCostAt(grid: Grid, x: number, y: number): number | boolean {
    if (!isInside(grid, x, y)) return false;
    return grid.nodes[y][x].cost;
}

export function setCostAt(grid: Grid, x: number, y: number, cost: number): Grid {
    // const newGrid = deepClone(grid)
    // newGrid.nodes[y][x].cost = cost
    // return newGrid
    grid.nodes[y][x].cost = cost
    return grid
}

export function getNeighbors(grid: Grid, node: GridNode): GridNode[] {
    const nodes = grid.nodes
    const x = node.x
    const y = node.y
    const neighbors: GridNode[] = []

    // ↑
    if (isWalkableAt(grid, x, y - 1)) {
        neighbors.push(nodes[y - 1][x]);
    }
    // →
    if (isWalkableAt(grid, x + 1, y)) {
        neighbors.push(nodes[y][x + 1]);
    }
    // ↓
    if (isWalkableAt(grid, x, y + 1)) {
        neighbors.push(nodes[y + 1][x]);
    }
    // ←
    if (isWalkableAt(grid, x - 1, y)) {
        neighbors.push(nodes[y][x - 1]);
    }

    return neighbors
}
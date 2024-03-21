/**
 * A* path-finder with specific requirements:
 * - Use manhattan heuristic
 * - Limit turns and avoid staircasing
 * Based on https://github.com/qiao/PathFinding.js
 */

import Heap from 'heap'
import type { GridNode, Grid } from './types'
import { getNodeAt, getNeighbors } from './grid'
import { deepClone } from '@modules/utils'

/* 
 * Config constants
 */

const TURN_PENALTY = 10
const HEURISTIC_WEIGHT = 1

/**
 * Backtrace according to the parent records and return the path.
 * (including both start and end nodes)
 */
function backtrace(endNode: GridNode): number[][] {
    var path = [[endNode.x, endNode.y]];
    while (endNode.parent) {
        endNode = endNode.parent;
        path.push([endNode.x, endNode.y]);
    }
    return path.reverse();
}

/*
 * Heuristics
 */
const manhattan = (dx: number, dy: number) => Math.abs(dx) + Math.abs(dy)
const heuristic = manhattan


export function findPath(
    grid: Grid,
    startX: number,
    startY: number,
    endX: number,
    endY: number): number[][] {

    const newGrid = deepClone(grid)

    let openList = new Heap(function (nodeA: GridNode, nodeB: GridNode) {
        return nodeA.f - nodeB.f;
    });

    const startNode: GridNode = getNodeAt(newGrid, startX, startY)
    const endNode: GridNode = getNodeAt(newGrid, endX, endY)

    let node: GridNode
    let neighbors: GridNode[]
    let neighbor: GridNode
    let lastDirection: { x: number; y: number; } | undefined
    let x: number
    let y: number
    let ng: number

    // Set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // Push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;

    console.log('openList', openList.toArray());

    // While the open list is not empty
    // while (!openList.isEmpty() && testCounter < 1000) {
    while (!openList.empty()) {
        // Pop the position of node which has the minimum `f` value.
        node = openList.pop() as GridNode;
        node.closed = true;

        // If reached the end position, construct the path and return it
        if (node === endNode) {
            // console.log('!!!!! DONE')
            return backtrace(endNode);
        }

        // Get neigbours of the current node
        neighbors = getNeighbors(newGrid, node);

        // console.log('neighbors', neighbors);

        for (let i = 0; i < neighbors.length; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // Get the next g score
            ng = neighbor.cost;

            // Avoid staircasing, add penalties if the direction will change
            lastDirection = node.parent == undefined ? undefined : { x: node.x - node.parent.x, y: node.y - node.parent.y };
            const turned = lastDirection == undefined ? 0 : lastDirection.x != x - node.x || lastDirection.y != y - node.y;
            ng += TURN_PENALTY * Number(turned);

            // Check if the neighbor has not been inspected yet, or can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || HEURISTIC_WEIGHT * heuristic(x - endX, y - endY);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    openList.updateItem(neighbor);
                }
            }
        } // End for each neighbor
    } // End while not open list empty

    // Fail to find the path
    return [];
};

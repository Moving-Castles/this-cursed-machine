import type { GraphConnection } from "../types"

export function generateSvgPath(connection: GraphConnection, cellHeight: number, cellWidth: number): string {
    if (connection.path.length === 0) return ""

    // Initialize an array to hold the adjusted path points, including the new start and end points
    let adjustedPath = []

    // Calculate the starting point that extends to the left edge of the first cell
    const firstPoint = connection.path[0]
    const extendedStartX = (firstPoint[0] + 0.5) * cellWidth - cellWidth / 2 // Adjust for center, then move to left edge
    const extendedStartY = (firstPoint[1] + 0.5) * cellHeight // Center Y coordinate
    adjustedPath.push([extendedStartX, extendedStartY])

    // Add the original path points, adjusted to center of cells
    const centerPoints = connection.path.map(([x, y]) => {
        const centerX = (x + 0.5) * cellWidth // Center X coordinate
        const centerY = (y + 0.5) * cellHeight // Center Y coordinate
        return [centerX, centerY]
    })
    adjustedPath = adjustedPath.concat(centerPoints)

    // Calculate the ending point that extends to the right edge of the last cell
    const lastPoint = connection.path[connection.path.length - 1]
    const extendedEndX = (lastPoint[0] + 0.5) * cellWidth + cellWidth / 2 // Adjust for center, then move to right edge
    const extendedEndY = (lastPoint[1] + 0.5) * cellHeight // Center Y coordinate
    adjustedPath.push([extendedEndX, extendedEndY])

    // Start the path at the first (extended) point
    let pathData = `M ${adjustedPath[0][0]},${adjustedPath[0][1]}`

    // Draw lines to each subsequent point, including the new last (extended) point
    adjustedPath.slice(1).forEach(point => {
        pathData += ` L ${point[0]},${point[1]}`
    })

    return pathData
}
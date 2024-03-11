import type { GraphConnection } from "../types"
import type { ElkExtendedEdge } from "elkjs"

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

type Point = {
    x: number;
    y: number;
};

type Section = {
    id: string;
    startPoint: Point;
    endPoint: Point;
    incomingShape: string;
    outgoingShape: string;
};

type PathObject = {
    id: string;
    sources: string[];
    targets: string[];
    sections: Section[];
    container: string;
};

export const generateSvgPath2 = (pathObject: ElkExtendedEdge): string => {
    // Initialize an empty SVG path data string
    let svgPathData = '';

    // Check if the sections property exists and has at least one section
    if (!pathObject.sections || pathObject.sections.length === 0) return svgPathData;

    // Iterate over each section in the pathObject
    pathObject.sections.forEach(section => {
        // Destructure the startPoint, endPoint, and bendPoints (if any) from the section
        const { startPoint, endPoint, bendPoints } = section;

        // Append the "Move To" command and coordinates to the SVG path data
        svgPathData += `M ${startPoint.x},${startPoint.y} `;

        // If bendPoints are present, append commands for each bend point
        if (bendPoints && bendPoints.length > 0) {
            bendPoints.forEach(bendPoint => {
                svgPathData += `L ${bendPoint.x},${bendPoint.y} `;
            });
        }

        // Append the "Line To" command and coordinates for the endPoint to the SVG path data
        svgPathData += `L ${endPoint.x},${endPoint.y} `;
    });

    // Return the SVG path data string, trimming any trailing whitespace
    return svgPathData.trim();
};
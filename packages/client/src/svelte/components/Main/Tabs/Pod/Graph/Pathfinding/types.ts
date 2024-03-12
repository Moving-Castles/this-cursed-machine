export type GridNode = {
    x: number,
    y: number,
    cost: number
    walkable: boolean,
    g?: number,
    h?: number,
    f?: number,
    opened?: boolean,
    closed?: boolean,
    parent?: GridNode
}

export type Grid = {
    width: number,
    height: number,
    nodes: GridNode[][]
}

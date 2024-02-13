
export enum MACHINE_STATE {
    IDLE,
    CONNECTED,
    RUNNING
}

export type GraphMachine = Machine & {
    id: string,
    x: number,
    y: number,
    state: MACHINE_STATE
}

export type GraphConnection = {
    from: string,
    to: string
}

export type GraphState = {
    machines: GraphMachine[],
    connections: any[]
};

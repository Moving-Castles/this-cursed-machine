import { derived } from "svelte/store";
import { machines, playerPod } from "../../../modules/state/base/stores";
import type { GraphState } from "./types";
import { MACHINE_STATE } from "./types";
import { MACHINE_TYPE } from "../../../modules/state/base/enums";

function layout(fixedEntities: FixedEntities, machinesInPod: Machines): GraphState {

    let connections: any[] = [];

    let machines = Object.entries(machinesInPod).map((machine) => {
        return {
            ...machine[1],
            id: machine[0],
            x: 0,
            y: 0,
            state: MACHINE_STATE.IDLE
        }
    }).map(machine => {
        if (machine.machineType === MACHINE_TYPE.PLAYER) {
            machine.x = 1;
            machine.y = 6;
        } else if (machine.id === fixedEntities.inlets[0]) {
            machine.x = 1;
            machine.y = 2;
        } else if (machine.id === fixedEntities.inlets[1]) {
            machine.x = 1;
            machine.y = 4;
        } else if (machine.id === fixedEntities.outlet) {
            machine.x = 1;
            machine.y = 11;
        }
        return machine
    });

    return {
        connections,
        machines
    }
}

export const graphState = derived([playerPod, machines], ([$playerPod, $machines]) => {
    return layout($playerPod.fixedEntities, $machines);
});
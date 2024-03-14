import { expect, test } from 'vitest'
import { applyPatches } from "../../src/svelte/modules/state/simulated/stores"
import { ENTITY_TYPE, MACHINE_TYPE } from 'contracts/enums'

const machines = {
    INLET_ONE: {
        entityType: ENTITY_TYPE.MACHINE,
        machineType: MACHINE_TYPE.INLET,
        carriedBy: "POD_ID",
        outgoingConnections: [],
        incomingConnections: [],
        depotConnection: "xxx"
    }
}

const patches = {
    INLET_ONE: {
        inputs: [
            {
                amount: 1000,
                inletActive: [true, false],
                machineId: "INLET_ONE",
                materialType: 1,
            },
        ],
        outputs: [
            {
                amount: 1000,
                inletActive: [true, false],
                machineId: "INLET_ONE",
                materialType: 1,
            },
        ],
    }
}

test("(1) applyPatches", () => {
    const expectedOutput = {
        INLET_ONE: {
            entityType: ENTITY_TYPE.MACHINE,
            machineType: MACHINE_TYPE.INLET,
            carriedBy: "POD_ID",
            outgoingConnections: [],
            incomingConnections: [],
            depotConnection: "xxx",
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1
                }
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1
                }
            ],
            product: {
                amount: 1000,
                inletActive: [true, false],
                machineId: "INLET_ONE",
                materialType: 1
            },
            state: 1
        }
    }

    expect(applyPatches(machines, patches)).toStrictEqual(expectedOutput)
})
import { expect, test } from 'vitest'
import { applyPatches } from "../../src/svelte/modules/state/simulated/stores"
import { ENTITY_TYPE, MACHINE_TYPE } from 'contracts/enums'
import { MaterialIds } from '../resolve'

const machines = {
    INLET_ONE: {
        entityType: ENTITY_TYPE.MACHINE,
        machineType: MACHINE_TYPE.INLET,
        carriedBy: "POD_ID",
        outgoingConnections: [],
        incomingConnections: [],
        tankConnection: "xxx"
    }
}

const patches = {
    INLET_ONE: {
        inputs: [
            {
                amount: 1000,
                inletActive: [true, false],
                machineId: "INLET_ONE",
                materialId: MaterialIds.BUG,
            },
        ],
        outputs: [
            {
                amount: 1000,
                inletActive: [true, false],
                machineId: "INLET_ONE",
                materialId: MaterialIds.BUG,
            },
        ],
        productive: false
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
            tankConnection: "xxx",
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialId: MaterialIds.BUG
                }
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialId: MaterialIds.BUG
                }
            ],
            products: [
                {
                    amount: 1000,
                    materialId: MaterialIds.BUG,
                }
            ],
            state: 1,
            productive: false
        }
    }

    expect(applyPatches(machines, patches)).toStrictEqual(expectedOutput)
})
import { expect, test } from 'vitest'
import { processOutputPatches, processInputPatches } from "../../src/svelte/modules/state/simulated/stores"

const simulated = {
    INLET_ONE: {}
}
const key = "INLET_ONE"
const patch = {
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
    productive: false
}

test("(1) processInputPatches", () => {
    const expectedOutput = {
        INLET_ONE: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1
                }
            ]
        }
    }

    expect(processInputPatches(simulated, key, patch)).toStrictEqual(expectedOutput)
})

test("(2) processOutputPatches", () => {
    const expectedOutput = {
        INLET_ONE: {
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1
                }
            ],
            products: [
                {
                    amount: 1000,
                    materialType: 1,
                }
            ],
            state: 1,
            productive: false
        }
    }

    expect(processOutputPatches(simulated, key, patch)).toStrictEqual(expectedOutput)
})
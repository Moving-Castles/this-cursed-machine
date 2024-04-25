import { MaterialIds } from "../resolve";

export const outputPatches = {
    "test1_1": {
        TANK_ONE: {
            tank: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "TANK_ONE",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: null,
                },
            ],
        },
        INLET_ONE: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: null,
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: null,
                },
            ],
            productive: true
        },
        PLAYER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: "INLET_ONE"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialId: MaterialIds.PISS,
                },
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialId: MaterialIds.BLOOD,
                },
            ],
            productive: true
        },
        OUTLET: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialId: MaterialIds.PISS,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialId: MaterialIds.PISS,
                    sourceMachineId: "PLAYER"
                },
            ],
            productive: true
        },
        TANK_TWO: {
            tank: true,
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "TANK_TWO",
                    materialId: MaterialIds.PISS,
                    sourceMachineId: "OUTLET",
                },
            ],
        },
    },
    "test1_2": {
        TANK_ONE: {
            tank: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "TANK_ONE",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: null
                },
            ],
        },
        INLET_TWO: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: null
                },
            ],
            productive: true
        },
        PLAYER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "PLAYER",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: "INLET_TWO"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "PLAYER",
                    materialId: MaterialIds.PISS,
                },
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "PLAYER",
                    materialId: MaterialIds.BLOOD,
                },
            ],
            productive: true
        },
        OUTLET: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "OUTLET",
                    materialId: MaterialIds.PISS,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "OUTLET",
                    materialId: MaterialIds.PISS,
                    sourceMachineId: "PLAYER"
                },
            ],
            productive: true
        },
        TANK_TWO: {
            tank: true,
            inputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "TANK_TWO",
                    materialId: MaterialIds.PISS,
                    sourceMachineId: "OUTLET"
                },
            ],
        },
    },
    "test2": {
        TANK_ONE: {
            tank: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "TANK_ONE",
                    materialId: MaterialIds.AMMONIA,
                    sourceMachineId: null,
                },
            ],
        },
        TANK_TWO: {
            tank: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "TANK_TWO",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: null,
                },
            ],
        },
        INLET_ONE: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialId: MaterialIds.AMMONIA,
                    sourceMachineId: null,
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialId: MaterialIds.AMMONIA,
                    sourceMachineId: null,
                },
            ],
            productive: true
        },
        INLET_TWO: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: null,
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: null,
                },
            ],
            productive: true
        },
        SPLITTER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "SPLITTER",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: "INLET_TWO",

                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "SPLITTER",
                    materialId: MaterialIds.CONGEALED_FAT,
                },
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "SPLITTER",
                    materialId: MaterialIds.CONGEALED_FAT,
                },
            ],
            productive: true
        },
        MIXER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "MIXER",
                    materialId: MaterialIds.AMMONIA,
                    sourceMachineId: "INLET_ONE",
                },
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "MIXER",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: "SPLITTER",
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, true],
                    machineId: "MIXER",
                    materialId: MaterialIds.SOAP,
                },
            ],
            productive: true
        },
        OUTLET: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, true],
                    machineId: "OUTLET",
                    materialId: MaterialIds.SOAP,
                    sourceMachineId: "MIXER",
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, true],
                    machineId: "OUTLET",
                    materialId: MaterialIds.SOAP,
                    sourceMachineId: "MIXER",
                },
            ],
            productive: true
        },
        TANK_THREE: {
            tank: true,
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, true],
                    machineId: "TANK_THREE",
                    materialId: MaterialIds.SOAP,
                    sourceMachineId: "OUTLET",
                },
            ],
        },
    },
    "test3": {
        TANK_ONE: {
            tank: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "TANK_ONE",
                    materialId: MaterialIds.AMMONIA,
                    sourceMachineId: null
                },
            ],
        },
        TANK_TWO: {
            tank: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "TANK_TWO",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: null
                },
            ],
        },
        INLET_ONE: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialId: MaterialIds.AMMONIA,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialId: MaterialIds.AMMONIA,
                    sourceMachineId: null
                },
            ],
        },
        INLET_TWO: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: null
                },
            ],
            productive: true
        },
        OUTLET: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "OUTLET",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: "INLET_TWO"
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "OUTLET",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: "INLET_TWO"
                },
            ],
            productive: true
        },
        TANK_THREE: {
            tank: true,
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "TANK_THREE",
                    materialId: MaterialIds.CONGEALED_FAT,
                    sourceMachineId: "OUTLET"
                },
            ],
        },
    },
    "test5": {
        INLET_ONE: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: null
                },
            ],
        },
        PLAYER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: "INLET_ONE"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialId: MaterialIds.PISS,
                },
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialId: MaterialIds.BLOOD,
                },
            ],
        },
    },
}
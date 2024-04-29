import { MaterialIds } from ".";

export const outputPatches = {
    "test1": {},
    "test2": {},
    "test3": {
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
    "test4": {
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
    "test5": {
        TANK_ONE: {
            tank: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "TANK_ONE",
                    materialId: MaterialIds.BUG,
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
                    sourceMachineId: "OUTLET"
                },
            ],
        },
    },
    "test6": {
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
                    materialId: MaterialIds.BLOOD,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialId: MaterialIds.BLOOD,
                    sourceMachineId: "PLAYER"
                },
            ],
            productive: true
        },
    },
    "test7": {
        TANK_ONE: {
            tank: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "TANK_ONE",
                    materialId: MaterialIds.BUG,
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
        SPLITTER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "SPLITTER",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: "INLET_ONE",
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "SPLITTER",
                    materialId: MaterialIds.BUG,
                },
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "SPLITTER",
                    materialId: MaterialIds.BUG,
                },
            ],
            productive: true
        },
        PLAYER: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: "SPLITTER"
                },
            ],
            outputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialId: MaterialIds.PISS,
                },
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialId: MaterialIds.BLOOD,
                },
            ],
            productive: true
        },
        DRYER_ONE: {
            inputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "DRYER_ONE",
                    materialId: MaterialIds.PISS,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "DRYER_ONE",
                    materialId: MaterialIds.UREA,
                },
            ],
            productive: true
        },
        BOILER: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "BOILER",
                    materialId: MaterialIds.BUG,
                    sourceMachineId: "SPLITTER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "BOILER",
                    materialId: MaterialIds.INDUSTRIAL_LUBRICANT,
                },
            ],
            productive: true
        },
        DRYER_TWO: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "DRYER_TWO",
                    materialId: MaterialIds.INDUSTRIAL_LUBRICANT,
                    sourceMachineId: "BOILER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "DRYER_TWO",
                    materialId: MaterialIds.FAT,
                },
            ],
            productive: true
        },
        MIXER: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "MIXER",
                    materialId: MaterialIds.FAT,
                    sourceMachineId: "DRYER_TWO"
                },
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "MIXER",
                    materialId: MaterialIds.UREA,
                    sourceMachineId: "DRYER_ONE"
                }
            ],
            outputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "MIXER",
                    materialId: MaterialIds.SOAP,
                },
            ],
            productive: true
        },
        OUTLET: {
            inputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialId: MaterialIds.SOAP,
                    sourceMachineId: "MIXER"
                },
            ],
            outputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialId: MaterialIds.SOAP,
                    sourceMachineId: "MIXER"
                },
            ],
            productive: true
        },
        TANK_TWO: {
            tank: true,
            inputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "TANK_TWO",
                    materialId: MaterialIds.SOAP,
                    sourceMachineId: "OUTLET"
                },
            ],
        },
    },
    "test8": {
        TANK_ONE: {
            tank: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "TANK_ONE",
                    materialId: MaterialIds.BUG,
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
                    materialId: MaterialIds.BLOOD,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialId: MaterialIds.BLOOD,
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
                    materialId: MaterialIds.BLOOD,
                    sourceMachineId: "OUTLET"
                },
            ],
        },
    },
    "test8_2": {
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
                    materialId: MaterialIds.BLOOD,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialId: MaterialIds.BLOOD,
                    sourceMachineId: "PLAYER"
                },
            ],
            productive: true
        },
    },
}
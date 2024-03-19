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
                    materialType: 1,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: "INLET_ONE"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 2,
                },
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 3,
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
                    materialType: 1,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: "INLET_ONE"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 2,
                },
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 3,
                },
            ],
        },
    },
    "test5": {
        DEPOT_ONE: {
            depot: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "DEPOT_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: "INLET_ONE"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 2,
                },
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 3,
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
                    materialType: 2,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 2,
                    sourceMachineId: "PLAYER"
                },
            ],
            productive: true
        },
        DEPOT_TWO: {
            depot: true,
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "DEPOT_TWO",
                    materialType: 2,
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
                    materialType: 1,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: "INLET_ONE"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 2,
                },
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 3,
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
                    materialType: 3,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 3,
                    sourceMachineId: "PLAYER"
                },
            ],
            productive: true
        },
    },
    "test7": {
        DEPOT_ONE: {
            depot: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "DEPOT_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: null,
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: "INLET_ONE",
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "SPLITTER",
                    materialType: 1,
                },
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "SPLITTER",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: "SPLITTER"
                },
            ],
            outputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 2,
                },
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 3,
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
                    materialType: 2,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "DRYER_ONE",
                    materialType: 7,
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
                    materialType: 1,
                    sourceMachineId: "SPLITTER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "BOILER",
                    materialType: 10,
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
                    materialType: 10,
                    sourceMachineId: "BOILER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "DRYER_TWO",
                    materialType: 9,
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
                    materialType: 9,
                    sourceMachineId: "DRYER_TWO"
                },
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "MIXER",
                    materialType: 7,
                    sourceMachineId: "DRYER_ONE"
                }
            ],
            outputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "MIXER",
                    materialType: 8,
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
                    materialType: 8,
                    sourceMachineId: "MIXER"
                },
            ],
            outputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 8,
                    sourceMachineId: "MIXER"
                },
            ],
            productive: true
        },
        DEPOT_TWO: {
            depot: true,
            inputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "DEPOT_TWO",
                    materialType: 8,
                    sourceMachineId: "OUTLET"
                },
            ],
        },
    },
    "test8": {
        DEPOT_ONE: {
            depot: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "DEPOT_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: "INLET_ONE"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 2,
                },
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 3,
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
                    materialType: 3,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 3,
                    sourceMachineId: "PLAYER"
                },
            ],
            productive: true
        },
        DEPOT_TWO: {
            depot: true,
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "DEPOT_TWO",
                    materialType: 3,
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
                    materialType: 1,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: "INLET_ONE"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 2,
                },
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 3,
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
                    materialType: 3,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 3,
                    sourceMachineId: "PLAYER"
                },
            ],
            productive: true
        },
    },
}
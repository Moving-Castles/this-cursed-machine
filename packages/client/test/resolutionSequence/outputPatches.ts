export const outputPatches = {
    "test1_1": {
        DEPOT_ONE: {
            depot: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "DEPOT_ONE",
                    materialType: 1,
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
                    sourceMachineId: "OUTLET",
                },
            ],
        },
    },
    "test1_2": {
        DEPOT_ONE: {
            depot: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "DEPOT_ONE",
                    materialType: 1,
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
                    materialType: 1,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
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
                    inletActive: [false, true],
                    machineId: "PLAYER",
                    materialType: 1,
                    sourceMachineId: "INLET_TWO"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "PLAYER",
                    materialType: 2,
                },
                {
                    amount: 500,
                    inletActive: [false, true],
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
                    inletActive: [false, true],
                    machineId: "OUTLET",
                    materialType: 2,
                    sourceMachineId: "PLAYER"
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
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
                    inletActive: [false, true],
                    machineId: "DEPOT_TWO",
                    materialType: 2,
                    sourceMachineId: "OUTLET"
                },
            ],
        },
    },
    "test2": {
        DEPOT_ONE: {
            depot: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "DEPOT_ONE",
                    materialType: 7,
                    sourceMachineId: null,
                },
            ],
        },
        DEPOT_TWO: {
            depot: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "DEPOT_TWO",
                    materialType: 9,
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
                    materialType: 7,
                    sourceMachineId: null,
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 7,
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
                    materialType: 9,
                    sourceMachineId: null,
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialType: 9,
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
                    materialType: 9,
                    sourceMachineId: "INLET_TWO",

                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "SPLITTER",
                    materialType: 9,
                },
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "SPLITTER",
                    materialType: 9,
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
                    materialType: 7,
                    sourceMachineId: "INLET_ONE",
                },
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "MIXER",
                    materialType: 9,
                    sourceMachineId: "SPLITTER",
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, true],
                    machineId: "MIXER",
                    materialType: 8,
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
                    materialType: 8,
                    sourceMachineId: "MIXER",
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, true],
                    machineId: "OUTLET",
                    materialType: 8,
                    sourceMachineId: "MIXER",
                },
            ],
            productive: true
        },
        DEPOT_THREE: {
            depot: true,
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, true],
                    machineId: "DEPOT_THREE",
                    materialType: 8,
                    sourceMachineId: "OUTLET",
                },
            ],
        },
    },
    "test3": {
        DEPOT_ONE: {
            depot: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "DEPOT_ONE",
                    materialType: 7,
                    sourceMachineId: null
                },
            ],
        },
        DEPOT_TWO: {
            depot: true,
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "DEPOT_TWO",
                    materialType: 9,
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
                    materialType: 7,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 7,
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
                    materialType: 9,
                    sourceMachineId: null
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialType: 9,
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
                    materialType: 9,
                    sourceMachineId: "INLET_TWO"
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "OUTLET",
                    materialType: 9,
                    sourceMachineId: "INLET_TWO"
                },
            ],
            productive: true
        },
        DEPOT_THREE: {
            depot: true,
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "DEPOT_THREE",
                    materialType: 9,
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
}
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
        },
        PLAYER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 1,
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
        OUTLET: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 2,
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 2,
                },
            ],
        },
        DEPOT_TWO: {
            depot: true,
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "DEPOT_TWO",
                    materialType: 2,
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
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialType: 1,
                },
            ],
        },
        PLAYER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "PLAYER",
                    materialType: 1,
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
        },
        OUTLET: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "OUTLET",
                    materialType: 2,
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "OUTLET",
                    materialType: 2,
                },
            ],
        },
        DEPOT_TWO: {
            depot: true,
            inputs: [
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "DEPOT_TWO",
                    materialType: 2,
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
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 7,
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
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialType: 9,
                },
            ],
        },
        SPLITTER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "SPLITTER",
                    materialType: 9,
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
            ]
        },
        MIXER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "MIXER",
                    materialType: 7,
                },
                {
                    amount: 500,
                    inletActive: [false, true],
                    machineId: "MIXER",
                    materialType: 9,
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
        },
        OUTLET: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, true],
                    machineId: "OUTLET",
                    materialType: 8,
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, true],
                    machineId: "OUTLET",
                    materialType: 8,
                },
            ],
        },
        DEPOT_THREE: {
            depot: true,
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, true],
                    machineId: "DEPOT_THREE",
                    materialType: 8,
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
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "INLET_ONE",
                    materialType: 7,
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
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "INLET_TWO",
                    materialType: 9,
                },
            ],
        },
        OUTLET: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "OUTLET",
                    materialType: 9,
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "OUTLET",
                    materialType: 9,
                },
            ],
        },
        DEPOT_THREE: {
            depot: true,
            inputs: [
                {
                    amount: 1000,
                    inletActive: [false, true],
                    machineId: "DEPOT_THREE",
                    materialType: 9,
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
        },
        PLAYER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 1,
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
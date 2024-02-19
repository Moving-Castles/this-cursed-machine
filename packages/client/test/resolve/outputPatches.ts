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
    "test4": {
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
    "test5": {
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
    "test6": {
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
                    materialType: 3,
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 3,
                },
            ],
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
        SPLITTER: {
            inputs: [
                {
                    amount: 1000,
                    inletActive: [true, false],
                    machineId: "SPLITTER",
                    materialType: 1,
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
        },
        PLAYER: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "PLAYER",
                    materialType: 1,
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
        },
        DRYER_ONE: {
            inputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "DRYER_ONE",
                    materialType: 2,
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
        },
        BOILER: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "BOILER",
                    materialType: 1,
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
        },
        DRYER_TWO: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "DRYER_TWO",
                    materialType: 10,
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
        },
        MIXER: {
            inputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "MIXER",
                    materialType: 9,
                },
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "MIXER",
                    materialType: 7,
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
        },
        OUTLET: {
            inputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 8,
                },
            ],
            outputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 8,
                },
            ],
        },
        DEPOT_TWO: {
            depot: true,
            inputs: [
                {
                    amount: 250,
                    inletActive: [true, false],
                    machineId: "DEPOT_TWO",
                    materialType: 8,
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
                    materialType: 3,
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 3,
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
                    materialType: 3,
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
                    materialType: 3,
                },
            ],
            outputs: [
                {
                    amount: 500,
                    inletActive: [true, false],
                    machineId: "OUTLET",
                    materialType: 3,
                },
            ],
        },
    },
}
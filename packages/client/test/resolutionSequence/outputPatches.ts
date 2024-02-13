export const outputPatches = {
    "test1_1": {
        DEPOT_ONE: {
            depot: true,
            outputs: [
                {
                    amount: 1000,
                    divisor: 0,
                    machineId: "DEPOT_ONE",
                    materialType: 1,
                },
            ],
        },
        INLET_ONE: {
            inputs: [
                {
                    amount: 1000,
                    divisor: 0,
                    machineId: "INLET_ONE",
                    materialType: 1,
                },
            ],
            outputs: [
                {
                    amount: 1000,
                    divisor: 0,
                    machineId: "INLET_ONE",
                    materialType: 1,
                },
            ],
        },
        PLAYER: {
            inputs: [
                {
                    amount: 1000,
                    divisor: 0,
                    machineId: "PLAYER",
                    materialType: 1,
                },
            ],
            outputs: [
                {
                    amount: 500,
                    divisor: 2,
                    machineId: "PLAYER",
                    materialType: 2,
                },
                {
                    amount: 500,
                    divisor: 2,
                    machineId: "PLAYER",
                    materialType: 3,
                },
            ],
        },
        OUTLET: {
            inputs: [
                {
                    amount: 500,
                    divisor: 2,
                    machineId: "OUTLET",
                    materialType: 2,
                },
            ],
            outputs: [
                {
                    amount: 500,
                    divisor: 2,
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
                    divisor: 2,
                    machineId: "DEPOT_TWO",
                    materialType: 2,
                },
            ],
        },
    },
}
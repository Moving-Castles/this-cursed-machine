import { expect, test } from 'vitest'
import { resolve } from "../../src/svelte/modules/state/resolver/resolve"
import { calculateSimulatedConnections, applyPatches } from "../../src/svelte/modules/state/simulated/stores"
import { createLayout } from "../../src/svelte/components/Main/Tabs/Pod/Graph2/layout"
import { setUp, createMachine } from "../resolve/setUp"
import { MACHINE_TYPE } from 'contracts/enums'
import { EMPTY_CONNECTION } from '../../src/svelte/modules/utils'

test("(1) createLayout", () => {
    const { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect PLAYER (PISS) to OUTLET
    machines["PLAYER"].outgoingConnections.push("OUTLET")
    machines["OUTLET"].incomingConnections.push("PLAYER")

    // Connect DEPOT 2 to OUTLET
    depots["DEPOT_TWO"].depotConnection = "OUTLET"
    machines["OUTLET"].depotConnection = "DEPOT_TWO"

    const patches = resolve(machines, inlets, outlet, depots, recipes)
    const simulatedMachines = applyPatches(machines, patches)
    const simulatedConnections = calculateSimulatedConnections(simulatedMachines);

    const expectedSimulatedConnections = [
        {
            id: 'FROM-INLET_ONE-TO-PLAYER-0',
            sourceMachine: 'INLET_ONE',
            targetMachine: 'PLAYER',
            portIndex: 0,
            product: {
                machineId: 'INLET_ONE',
                materialType: 1,
                amount: 1000,
                inletActive: [true, false]
            }
        },
        {
            id: 'FROM-PLAYER-TO-OUTLET-0',
            sourceMachine: 'PLAYER',
            targetMachine: 'OUTLET',
            portIndex: 0,
            product: {
                machineId: 'PLAYER',
                materialType: 2,
                amount: 500,
                inletActive: [true, false]
            }
        }
    ]

    expect(simulatedConnections).toStrictEqual(expectedSimulatedConnections)

    const layout = createLayout(fixedEntities, simulatedMachines, simulatedConnections, {}, [])

    const expectedLayout = {
        graphMachines: {
            INLET_ONE: {
                entity: 3,
                machineType: 1,
                depotConnection: "DEPOT_ONE",
                incomingConnections: [],
                outgoingConnections: [
                    "PLAYER"
                ],
                buildIndex: 1,
                inputs: [
                    {
                        machineId: "INLET_ONE",
                        materialType: 1,
                        amount: 1000,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                outputs: [
                    {
                        machineId: "INLET_ONE",
                        materialType: 1,
                        amount: 1000,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                x: 0,
                y: 1
            },
            INLET_TWO: {
                entity: 3,
                machineType: 1,
                depotConnection: "",
                incomingConnections: [],
                outgoingConnections: [],
                buildIndex: 2,
                x: 0,
                y: 3
            },
            OUTLET: {
                entity: 3,
                machineType: 2,
                depotConnection: "DEPOT_TWO",
                incomingConnections: [
                    "PLAYER"
                ],
                outgoingConnections: [],
                buildIndex: 1,
                inputs: [
                    {
                        machineId: "OUTLET",
                        materialType: 2,
                        amount: 500,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                outputs: [
                    {
                        machineId: "OUTLET",
                        materialType: 2,
                        amount: 500,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                x: 10,
                y: 2
            },
            PLAYER: {
                entity: 3,
                machineType: 3,
                depotConnection: "",
                incomingConnections: [
                    "INLET_ONE"
                ],
                outgoingConnections: [
                    "OUTLET"
                ],
                buildIndex: 1,
                inputs: [
                    {
                        machineId: "PLAYER",
                        materialType: 1,
                        amount: 1000,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                outputs: [
                    {
                        machineId: "PLAYER",
                        materialType: 2,
                        amount: 500,
                        inletActive: [
                            true,
                            false
                        ]
                    },
                    {
                        machineId: "PLAYER",
                        materialType: 3,
                        amount: 500,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                x: 5,
                y: 2
            }
        },
        graphConnections: [
            {
                id: "FROM-INLET_ONE-TO-PLAYER-0",
                sourceMachine: "INLET_ONE",
                targetMachine: "PLAYER",
                portIndex: 0,
                product: {
                    machineId: "INLET_ONE",
                    materialType: 1,
                    amount: 1000,
                    inletActive: [
                        true,
                        false
                    ]
                },
                path: [
                    [
                        1,
                        1
                    ],
                    [
                        2,
                        1
                    ],
                    [
                        3,
                        1
                    ],
                    [
                        4,
                        1
                    ],
                    [
                        4,
                        2
                    ]
                ]
            },
            {
                id: "FROM-PLAYER-TO-OUTLET-0",
                sourceMachine: "PLAYER",
                targetMachine: "OUTLET",
                portIndex: 0,
                product: {
                    machineId: "PLAYER",
                    materialType: 2,
                    amount: 500,
                    inletActive: [
                        true,
                        false
                    ]
                },
                path: [
                    [
                        6,
                        2
                    ],
                    [
                        7,
                        2
                    ],
                    [
                        8,
                        2
                    ],
                    [
                        9,
                        2
                    ]
                ]
            }
        ]
    }

    expect(layout).toStrictEqual(expectedLayout)
})

test("(2) createLayout 2", () => {
    const { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // Build dryer
    machines["DRYER"] = createMachine(MACHINE_TYPE.DRYER, 1)

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect PLAYER (BLOOD) to OUTLET
    machines["PLAYER"].outgoingConnections = [EMPTY_CONNECTION, "DRYER"]
    machines["DRYER"].incomingConnections.push("PLAYER")

    // Connect DRYER to OUTLET
    machines["DRYER"].outgoingConnections.push("OUTLET")
    machines["OUTLET"].incomingConnections.push("DRYER")

    // Connect DEPOT 2 to OUTLET
    depots["DEPOT_TWO"].depotConnection = "OUTLET"
    machines["OUTLET"].depotConnection = "DEPOT_TWO"

    const patches = resolve(machines, inlets, outlet, depots, recipes)
    const simulatedMachines = applyPatches(machines, patches)
    const simulatedConnections = calculateSimulatedConnections(simulatedMachines);

    const expectedSimulatedConnections = [
        {
            id: 'FROM-INLET_ONE-TO-PLAYER-0',
            sourceMachine: 'INLET_ONE',
            targetMachine: 'PLAYER',
            portIndex: 0,
            product: {
                machineId: 'INLET_ONE',
                materialType: 1,
                amount: 1000,
                inletActive: [true, false]
            }
        },
        {
            id: 'FROM-PLAYER-TO-DRYER-1',
            sourceMachine: 'PLAYER',
            targetMachine: 'DRYER',
            portIndex: 1,
            product: {
                machineId: 'PLAYER',
                materialType: 3, // Blood
                amount: 500,
                inletActive: [true, false]
            }
        },
        {
            id: 'FROM-DRYER-TO-OUTLET-0',
            sourceMachine: 'DRYER',
            targetMachine: 'OUTLET',
            portIndex: 0,
            product: {
                machineId: 'DRYER',
                materialType: 4, // Blood meal
                amount: 500,
                inletActive: [true, false]
            }
        }
    ]

    expect(simulatedConnections).toStrictEqual(expectedSimulatedConnections)

    const layout = createLayout(fixedEntities, simulatedMachines, simulatedConnections, {}, [])

    const expectedLayout = {
        graphMachines: {
            INLET_ONE: {
                entity: 3,
                machineType: 1,
                depotConnection: "DEPOT_ONE",
                incomingConnections: [],
                outgoingConnections: [
                    "PLAYER"
                ],
                buildIndex: 1,
                inputs: [
                    {
                        machineId: "INLET_ONE",
                        materialType: 1,
                        amount: 1000,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                outputs: [
                    {
                        machineId: "INLET_ONE",
                        materialType: 1,
                        amount: 1000,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                x: 0,
                y: 1
            },
            INLET_TWO: {
                entity: 3,
                machineType: 1,
                depotConnection: "",
                incomingConnections: [],
                outgoingConnections: [],
                buildIndex: 2,
                x: 0,
                y: 3
            },
            OUTLET: {
                entity: 3,
                machineType: 2,
                depotConnection: "DEPOT_TWO",
                incomingConnections: [
                    "DRYER"
                ],
                outgoingConnections: [],
                buildIndex: 1,
                inputs: [
                    {
                        machineId: "OUTLET",
                        materialType: 4,
                        amount: 500,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                outputs: [
                    {
                        machineId: "OUTLET",
                        materialType: 4,
                        amount: 500,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                x: 10,
                y: 2
            },
            PLAYER: {
                entity: 3,
                machineType: 3,
                depotConnection: "",
                incomingConnections: [
                    "INLET_ONE"
                ],
                outgoingConnections: [
                    "0x0000000000000000000000000000000000000000000000000000000000000000",
                    "DRYER"
                ],
                buildIndex: 1,
                inputs: [
                    {
                        machineId: "PLAYER",
                        materialType: 1,
                        amount: 1000,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                outputs: [
                    {
                        machineId: "PLAYER",
                        materialType: 2,
                        amount: 500,
                        inletActive: [
                            true,
                            false
                        ]
                    },
                    {
                        machineId: "PLAYER",
                        materialType: 3,
                        amount: 500,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                x: 5,
                y: 2
            },
            DRYER: {
                entity: 3,
                machineType: 6,
                depotConnection: "",
                incomingConnections: [
                    "PLAYER"
                ],
                outgoingConnections: [
                    "OUTLET"
                ],
                buildIndex: 1,
                inputs: [
                    {
                        machineId: "DRYER",
                        materialType: 3,
                        amount: 500,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                outputs: [
                    {
                        machineId: "DRYER",
                        materialType: 4,
                        amount: 500,
                        inletActive: [
                            true,
                            false
                        ]
                    }
                ],
                x: 3,
                y: 1
            }
        },
        graphConnections: [
            {
                id: "FROM-INLET_ONE-TO-PLAYER-0",
                sourceMachine: "INLET_ONE",
                targetMachine: "PLAYER",
                portIndex: 0,
                product: {
                    machineId: "INLET_ONE",
                    materialType: 1,
                    amount: 1000,
                    inletActive: [
                        true,
                        false
                    ]
                },
                path: [
                    [
                        1,
                        1
                    ],
                    [
                        2,
                        1
                    ],
                    [
                        2,
                        2
                    ],
                    [
                        3,
                        2
                    ],
                    [
                        4,
                        2
                    ]
                ]
            },
            {
                id: "FROM-PLAYER-TO-DRYER-1",
                sourceMachine: "PLAYER",
                targetMachine: "DRYER",
                portIndex: 1,
                product: {
                    machineId: "PLAYER",
                    materialType: 3,
                    amount: 500,
                    inletActive: [
                        true,
                        false
                    ]
                },
                path: [
                    [
                        6,
                        2
                    ],
                    [
                        6,
                        1
                    ],
                    [
                        5,
                        1
                    ],
                    [
                        4,
                        1
                    ],
                    [
                        4,
                        0
                    ],
                    [
                        3,
                        0
                    ],
                    [
                        2,
                        0
                    ],
                    [
                        2,
                        1
                    ]
                ]
            },
            {
                id: "FROM-DRYER-TO-OUTLET-0",
                sourceMachine: "DRYER",
                targetMachine: "OUTLET",
                portIndex: 0,
                product: {
                    machineId: "DRYER",
                    materialType: 4,
                    amount: 500,
                    inletActive: [
                        true,
                        false
                    ]
                },
                path: [
                    [
                        4,
                        1
                    ],
                    [
                        5,
                        1
                    ],
                    [
                        6,
                        1
                    ],
                    [
                        7,
                        1
                    ],
                    [
                        8,
                        1
                    ],
                    [
                        9,
                        1
                    ],
                    [
                        9,
                        2
                    ]
                ]
            }
        ]
    }

    expect(layout).toStrictEqual(expectedLayout)

})




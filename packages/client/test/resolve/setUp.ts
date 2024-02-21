import { RECIPES } from '.'
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from 'contracts/enums'

export function createMachine(machineType: MACHINE_TYPE, buildIndex: number) {
    return {
        entity: ENTITY_TYPE.MACHINE,
        machineType,
        depotConnection: "",
        incomingConnections: [],
        outgoingConnections: [],
        buildIndex
    }
}

export function setUp() {
    let depots = {}

    depots["DEPOT_ONE"] = {
        entityType: ENTITY_TYPE.DEPOT,
        materialType: MATERIAL_TYPE.BUG,
        amount: 20000,
        depotConnection: "",
        buildIndex: 1
    }

    depots["DEPOT_TWO"] = {
        entityType: ENTITY_TYPE.DEPOT,
        depotConnection: "",
        buildIndex: 2,
    }

    depots["DEPOT_THREE"] = {
        entityType: ENTITY_TYPE.DEPOT,
        depotConnection: "",
        buildIndex: 3
    }

    let machines = {}

    // Inlet 1
    machines["INLET_ONE"] = createMachine(MACHINE_TYPE.INLET, 1)

    // Inlet 2
    machines["INLET_TWO"] = createMachine(MACHINE_TYPE.INLET, 2)

    // Outlet
    machines["OUTLET"] = createMachine(MACHINE_TYPE.OUTLET, 1)

    // Player
    machines["PLAYER"] = createMachine(MACHINE_TYPE.PLAYER, 1)

    let inlets = {}
    inlets["INLET_ONE"] = machines["INLET_ONE"]
    inlets["INLET_TWO"] = machines["INLET_TWO"]

    let outlet = {}
    outlet["OUTLET"] = machines["OUTLET"]

    const fixedEntities = {
        inlets: ["INLET_ONE", "INLET_TWO"],
        outlet: "OUTLET"
    }

    const recipes = RECIPES

    return { depots, machines, inlets, outlet, recipes, fixedEntities }
}
import { RECIPES } from '.'
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from 'contracts/enums'

export function createMachine(machineType: MACHINE_TYPE) {
    return {
        entity: ENTITY_TYPE.MACHINE,
        machineType,
        depotConnection: "",
        incomingConnections: [],
        outgoingConnections: []
    }
}

export function setUp() {
    let depots = {}

    depots["DEPOT_ONE"] = {
        entityType: ENTITY_TYPE.DEPOT,
        materialType: MATERIAL_TYPE.BUG,
        amount: 20000,
        depotConnection: ""
    }

    depots["DEPOT_TWO"] = {
        entityType: ENTITY_TYPE.DEPOT,
        depotConnection: ""
    }

    let machines = {}

    // Inlet 1
    machines["INLET_ONE"] = createMachine(MACHINE_TYPE.INLET)

    // Inlet 2
    machines["INLET_TWO"] = createMachine(MACHINE_TYPE.INLET)

    // Outlet
    machines["OUTLET"] = createMachine(MACHINE_TYPE.OUTLET)

    // Player
    machines["PLAYER"] = createMachine(MACHINE_TYPE.PLAYER)

    let inlets = {}
    inlets["INLET_ONE"] = machines["INLET_ONE"]
    inlets["INLET_TWO"] = machines["INLET_TWO"]

    let outlet = {}
    outlet["OUTLET"] = machines["OUTLET"]

    const recipes = RECIPES

    return { depots, machines, inlets, outlet, recipes }
}
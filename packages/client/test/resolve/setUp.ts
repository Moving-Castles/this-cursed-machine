import { RECIPES } from '.'
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from 'contracts/enums'

export function createMachine(machineType: MACHINE_TYPE, buildIndex: number) {
    return {
        entity: ENTITY_TYPE.MACHINE,
        machineType,
        tankConnection: "",
        incomingConnections: [],
        outgoingConnections: [],
        buildIndex
    }
}

export function setUp() {
    let tanks = {}

    tanks["TANK_ONE"] = {
        entityType: ENTITY_TYPE.TANK,
        materialType: MATERIAL_TYPE.BUG,
        amount: 20000,
        tankConnection: "",
        buildIndex: 1
    }

    tanks["TANK_TWO"] = {
        entityType: ENTITY_TYPE.TANK,
        tankConnection: "",
        buildIndex: 2,
    }

    tanks["TANK_THREE"] = {
        entityType: ENTITY_TYPE.TANK,
        tankConnection: "",
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

    return { tanks, machines, inlets, outlet, recipes, fixedEntities }
}
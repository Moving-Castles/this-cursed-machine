import { expect, test } from 'vitest'
import { resolve } from "../../src/svelte/modules/state/resolver/resolve"
import { setUp, createMachine } from "./setUp"
import { outputPatches } from './outputPatches'
import { MACHINE_TYPE } from 'contracts/enums'
import { EMPTY_CONNECTION } from '../../src/svelte/modules/utils'

test("(1) resolve: no connections", () => {
    const { depots, machines, inlets, outlet, recipes } = setUp()

    expect(resolve(machines, inlets, outlet, depots, recipes)).toStrictEqual(outputPatches.test1)
})

test("(2) resolve: depot 1 to inlet", () => {
    let { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"] = "DEPOT_ONE"

    // Should be empty
    expect(resolve(machines, inlets, outlet, depots, recipes)).toStrictEqual(outputPatches.test2)
})

test("(3) resolve: depot 1 to inlet, inlet to player", () => {
    let { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Should be:
    // No depot patches as circuit is not closed
    // 1000 bug from inlet
    // 500 blood and 500 piss from player
    expect(resolve(machines, inlets, outlet, depots, recipes)).toStrictEqual(outputPatches.test3)
})

test("(4) resolve: depot 1 to inlet, inlet to player, depot2 to outlet", () => {
    let { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect DEPOT 2 to OUTLET
    depots["DEPOT_TWO"].depotConnection = "OUTLET"
    machines["OUTLET"].depotConnection = "DEPOT_TWO"

    // Should be:
    // No depot patches as circuit is not closed
    // 1000 bug from inlet
    // 500 blood and 500 piss from player
    expect(resolve(machines, inlets, outlet, depots, recipes)).toStrictEqual(outputPatches.test4)
})

test("(5) resolve: depot 1 to inlet, inlet to player, player (piss) to outlet, depot2 to outlet", () => {
    let { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

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

    // Should be:
    // Circuit closed, depot patches created
    // 1000 bug from inlet
    // 500 blood and 500 piss from player
    // 500 piss to outlet
    // 500 piss to depot 2
    expect(resolve(machines, inlets, outlet, depots, recipes)).toStrictEqual(outputPatches.test5)
})

test("(6) resolve: depot 1 to inlet, inlet to player, player (blood) to outlet", () => {
    let { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect PLAYER (blood) to OUTLET
    machines["PLAYER"].outgoingConnections = [null, "OUTLET"]
    machines["OUTLET"].incomingConnections.push("PLAYER")

    // Should be:
    // Circuit open, no depot patches created
    // 1000 bug from inlet
    // 500 blood and 500 piss from player
    // 500 blood to outlet
    // 500 blood to depot 2
    expect(resolve(machines, inlets, outlet, depots, recipes)).toStrictEqual(outputPatches.test6)
})

test("(7) resolve: create AESOP_ORGANIC_HAND_SOAP", () => {
    let { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // - Build Splitter
    machines["SPLITTER"] = createMachine(MACHINE_TYPE.SPLITTER, 1)
    // - Build boiler
    machines["BOILER"] = createMachine(MACHINE_TYPE.BOILER, 1)
    // - Build dryer one
    machines["DRYER_ONE"] = createMachine(MACHINE_TYPE.DRYER, 1)
    // - Build dryer two
    machines["DRYER_TWO"] = createMachine(MACHINE_TYPE.DRYER, 2)
    // - Build mixer
    machines["MIXER"] = createMachine(MACHINE_TYPE.MIXER, 1)

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // - Connect inlet to Splitter
    machines["INLET_ONE"].outgoingConnections.push("SPLITTER")
    machines["SPLITTER"].incomingConnections.push("SPLITTER")

    // - Connect splitter to player
    machines["SPLITTER"].outgoingConnections.push("PLAYER");
    machines["PLAYER"].incomingConnections.push("SPLITTER");

    // - Connect player (piss) to dryer one
    machines["PLAYER"].outgoingConnections.push("DRYER_ONE");
    machines["DRYER_ONE"].incomingConnections.push("PLAYER");

    // - Connect dryer one to mixer
    machines["DRYER_ONE"].outgoingConnections.push("MIXER");
    machines["MIXER"].incomingConnections.push("DRYER_ONE");

    // - Connect splitter to boiler
    machines["SPLITTER"].outgoingConnections.push("BOILER");
    machines["BOILER"].incomingConnections.push("SPLITTER");

    // - Connect boiler to dryer two
    machines["BOILER"].outgoingConnections.push("DRYER_TWO");
    machines["DRYER_TWO"].incomingConnections.push("BOILER");

    // - Connect dryer two to mixer
    machines["DRYER_TWO"].outgoingConnections.push("MIXER");
    machines["MIXER"].incomingConnections.push("DRYER_TWO");

    // - Connect mixer to outlet
    machines["MIXER"].outgoingConnections.push("OUTLET");
    machines["OUTLET"].incomingConnections.push("MIXER");

    // Connect DEPOT 2 to OUTLET
    depots["DEPOT_TWO"].depotConnection = "OUTLET"
    machines["OUTLET"].depotConnection = "DEPOT_TWO"

    expect(resolve(machines, inlets, outlet, depots, recipes)).toStrictEqual(outputPatches.test7)
})

test("(8) resolve: clear on disconnect", () => {
    let { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect PLAYER (blood) to OUTLET
    machines["PLAYER"].outgoingConnections = [null, "OUTLET"]
    machines["OUTLET"].incomingConnections.push("PLAYER")

    // Connect DEPOT 2 to OUTLET
    depots["DEPOT_TWO"].depotConnection = "OUTLET"
    machines["OUTLET"].depotConnection = "DEPOT_TWO"

    // Should be:
    // Circuit open, no depot patches created
    // 1000 bug from inlet
    // 500 blood and 500 piss from player
    // 500 blood to outlet
    // 500 blood to depot 2
    expect(resolve(machines, inlets, outlet, depots, recipes)).toStrictEqual(outputPatches.test8)

    // Disconnect DEPOT 2 from OUTLET
    depots["DEPOT_TWO"].depotConnection = EMPTY_CONNECTION
    machines["OUTLET"].depotConnection = EMPTY_CONNECTION

    expect(resolve(machines, inlets, outlet, depots, recipes)).toStrictEqual(outputPatches.test8_2)

    // Disconnect DEPOT 1 from INLET 1
    depots["DEPOT_ONE"].depotConnection = EMPTY_CONNECTION
    machines["INLET_ONE"].depotConnection = EMPTY_CONNECTION

    expect(resolve(machines, inlets, outlet, depots, recipes)).toStrictEqual({})
})
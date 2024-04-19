import { expect, test } from 'vitest'
import { resolve } from "../../src/svelte/modules/state/resolver/resolve"
import { setUp, createMachine } from "./setUp"
import { outputPatches } from './outputPatches'
import { MACHINE_TYPE } from 'contracts/enums'
import { EMPTY_CONNECTION } from '../../src/svelte/modules/utils/constants'

test("(1) resolve: no connections", () => {
    const { tanks, machines, inlets, outlet, recipes } = setUp()

    expect(resolve(machines, inlets, outlet, tanks, recipes)).toStrictEqual(outputPatches.test1)
})

test("(2) resolve: tank 1 to inlet", () => {
    let { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect TANK 1 to INLET 1
    tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    machines["INLET_ONE"] = "TANK_ONE"

    // Should be empty
    expect(resolve(machines, inlets, outlet, tanks, recipes)).toStrictEqual(outputPatches.test2)
})

test("(3) resolve: tank 1 to inlet, inlet to player", () => {
    let { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect TANK 1 to INLET 1
    tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    machines["INLET_ONE"].tankConnection = "TANK_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Should be:
    // No tank patches as circuit is not closed
    // 1000 bug from inlet
    // 500 blood and 500 piss from player
    expect(resolve(machines, inlets, outlet, tanks, recipes)).toStrictEqual(outputPatches.test3)
})

test("(4) resolve: tank 1 to inlet, inlet to player, tank2 to outlet", () => {
    let { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect TANK 1 to INLET 1
    tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    machines["INLET_ONE"].tankConnection = "TANK_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect TANK 2 to OUTLET
    tanks["TANK_TWO"].tankConnection = "OUTLET"
    machines["OUTLET"].tankConnection = "TANK_TWO"

    // Should be:
    // No tank patches as circuit is not closed
    // 1000 bug from inlet
    // 500 blood and 500 piss from player
    expect(resolve(machines, inlets, outlet, tanks, recipes)).toStrictEqual(outputPatches.test4)
})

test("(5) resolve: tank 1 to inlet, inlet to player, player (piss) to outlet, tank2 to outlet", () => {
    let { tanks, machines, inlets, outlet, recipes } = setUp()

    // Connect TANK 1 to INLET 1
    tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    machines["INLET_ONE"].tankConnection = "TANK_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect PLAYER (PISS) to OUTLET
    machines["PLAYER"].outgoingConnections.push("OUTLET")
    machines["OUTLET"].incomingConnections.push("PLAYER")

    // Connect TANK 2 to OUTLET
    tanks["TANK_TWO"].tankConnection = "OUTLET"
    machines["OUTLET"].tankConnection = "TANK_TWO"

    // Should be:
    // Circuit closed, tank patches created
    // 1000 bug from inlet
    // 500 blood and 500 piss from player
    // 500 piss to outlet
    // 500 piss to tank 2
    expect(resolve(machines, inlets, outlet, tanks, recipes)).toStrictEqual(outputPatches.test5)
})

test("(6) resolve: tank 1 to inlet, inlet to player, player (blood) to outlet", () => {
    let { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect TANK 1 to INLET 1
    tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    machines["INLET_ONE"].tankConnection = "TANK_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect PLAYER (blood) to OUTLET
    machines["PLAYER"].outgoingConnections = [null, "OUTLET"]
    machines["OUTLET"].incomingConnections.push("PLAYER")

    // Should be:
    // Circuit open, no tank patches created
    // 1000 bug from inlet
    // 500 blood and 500 piss from player
    // 500 blood to outlet
    // 500 blood to tank 2
    expect(resolve(machines, inlets, outlet, tanks, recipes)).toStrictEqual(outputPatches.test6)
})

test("(7) resolve: create AESOP_ORGANIC_HAND_SOAP", () => {
    //     let { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    //     // - Build Splitter
    //     machines["SPLITTER"] = createMachine(MACHINE_TYPE.SPLITTER, 1)
    //     // - Build boiler
    //     machines["BOILER"] = createMachine(MACHINE_TYPE.BOILER, 1)
    //     // - Build dryer one
    //     machines["DRYER_ONE"] = createMachine(MACHINE_TYPE.DRYER, 1)
    //     // - Build dryer two
    //     machines["DRYER_TWO"] = createMachine(MACHINE_TYPE.DRYER, 2)
    //     // - Build mixer
    //     machines["MIXER"] = createMachine(MACHINE_TYPE.MIXER, 1)

    //     // Connect TANK 1 to INLET 1
    //     tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    //     machines["INLET_ONE"].tankConnection = "TANK_ONE"

    //     // - Connect inlet to Splitter
    //     machines["INLET_ONE"].outgoingConnections.push("SPLITTER")
    //     machines["SPLITTER"].incomingConnections.push("SPLITTER")

    //     // - Connect splitter to player
    //     machines["SPLITTER"].outgoingConnections.push("PLAYER");
    //     machines["PLAYER"].incomingConnections.push("SPLITTER");

    //     // - Connect player (piss) to dryer one
    //     machines["PLAYER"].outgoingConnections.push("DRYER_ONE");
    //     machines["DRYER_ONE"].incomingConnections.push("PLAYER");

    //     // - Connect dryer one to mixer
    //     machines["DRYER_ONE"].outgoingConnections.push("MIXER");
    //     machines["MIXER"].incomingConnections.push("DRYER_ONE");

    //     // - Connect splitter to boiler
    //     machines["SPLITTER"].outgoingConnections.push("BOILER");
    //     machines["BOILER"].incomingConnections.push("SPLITTER");

    //     // - Connect boiler to dryer two
    //     machines["BOILER"].outgoingConnections.push("DRYER_TWO");
    //     machines["DRYER_TWO"].incomingConnections.push("BOILER");

    //     // - Connect dryer two to mixer
    //     machines["DRYER_TWO"].outgoingConnections.push("MIXER");
    //     machines["MIXER"].incomingConnections.push("DRYER_TWO");

    //     // - Connect mixer to outlet
    //     machines["MIXER"].outgoingConnections.push("OUTLET");
    //     machines["OUTLET"].incomingConnections.push("MIXER");

    //     // Connect TANK 2 to OUTLET
    //     tanks["TANK_TWO"].tankConnection = "OUTLET"
    //     machines["OUTLET"].tankConnection = "TANK_TWO"

    //     expect(resolve(machines, inlets, outlet, tanks, recipes)).toStrictEqual(outputPatches.test7)
})

test("(8) resolve: clear on disconnect", () => {
    let { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Connect TANK 1 to INLET 1
    tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    machines["INLET_ONE"].tankConnection = "TANK_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect PLAYER (blood) to OUTLET
    machines["PLAYER"].outgoingConnections = [null, "OUTLET"]
    machines["OUTLET"].incomingConnections.push("PLAYER")

    // Connect TANK 2 to OUTLET
    tanks["TANK_TWO"].tankConnection = "OUTLET"
    machines["OUTLET"].tankConnection = "TANK_TWO"

    // Should be:
    // Circuit open, no tank patches created
    // 1000 bug from inlet
    // 500 blood and 500 piss from player
    // 500 blood to outlet
    // 500 blood to tank 2
    expect(resolve(machines, inlets, outlet, tanks, recipes)).toStrictEqual(outputPatches.test8)

    // Disconnect TANK 2 from OUTLET
    tanks["TANK_TWO"].tankConnection = EMPTY_CONNECTION
    machines["OUTLET"].tankConnection = EMPTY_CONNECTION

    expect(resolve(machines, inlets, outlet, tanks, recipes)).toStrictEqual(outputPatches.test8_2)

    // Disconnect TANK 1 from INLET 1
    tanks["TANK_ONE"].tankConnection = EMPTY_CONNECTION
    machines["INLET_ONE"].tankConnection = EMPTY_CONNECTION

    expect(resolve(machines, inlets, outlet, tanks, recipes)).toStrictEqual({})
})
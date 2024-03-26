// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";

contract BuildSystemTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] depotsInPod;
  FixedEntitiesData fixedEntities;

  function setUp() public override {
    super.setUp();
    vm.startPrank(alice);

    playerEntity = world.spawn();
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    fixedEntities = FixedEntities.get(podEntity);

    depotsInPod = DepotsInPod.get(podEntity);

    vm.stopPrank();
  }

  function testReset() public {
    setUp();

    vm.startPrank(alice);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Build splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Connect player (piss) to splitter
    world.connect(playerEntity, splitterEntity, PORT_INDEX.FIRST);

    // Connect splitter to outlet
    world.connect(splitterEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait
    uint32 blocksToWait = 30;
    vm.roll(block.number + blocksToWait);

    // Resolve
    startGasReport("Reset pod");
    world.reset();
    endGasReport();

    // 4 = number of fixed entities
    assertEq(MachinesInPod.get(podEntity).length, 4);

    for (uint i; i < depotsInPod.length; i++) {
      assertEq(DepotConnection.get(depotsInPod[i]), bytes32(0));
    }

    vm.stopPrank();
  }
}

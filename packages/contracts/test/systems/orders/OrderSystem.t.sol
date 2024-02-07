// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX, MATERIAL_TYPE } from "../../../src/codegen/common.sol";
import { FLOW_RATE } from "../../../src/constants.sol";

contract OrderSystemTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] depotsInPod;
  bytes32[] tutorialLevels;

  function setUp() public override {
    super.setUp();
    vm.startPrank(alice);

    // Spawn player
    playerEntity = world.spawn();
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    depotsInPod = DepotsInPod.get(podEntity);

    tutorialLevels = TutorialOrders.get();

    vm.stopPrank();
  }

  function testFill() public {
    setUp();

    vm.startPrank(alice);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], MACHINE_TYPE.INLET);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], MACHINE_TYPE.OUTLET);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (blood) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.SECOND);

    // Wait 40 blocks
    vm.roll(block.number + 40);

    // Disconnect depot and resolve
    world.detachDepot(MACHINE_TYPE.OUTLET);

    // 4 blocks passed
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(MATERIAL_TYPE.BUG));
    // Inlet material spent => 40 * FLOW_RATE = 400
    assertEq(Amount.get(depotsInPod[0]), 2000 - (40 * FLOW_RATE)); // 2000 - 400 = 0
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.BLOOD));
    // Outlet material gained => 4 * 50 = 200
    assertEq(Amount.get(depotsInPod[1]), ((40 * FLOW_RATE) / 2)); // 0 + 200 = 200

    // Order is fullfilled
    world.fill(depotsInPod[1]);

    // Depot should be empty
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.NONE));
    assertEq(Amount.get(depotsInPod[1]), 0);

    // Order is set to second tutorial order
    assertEq(CurrentOrder.get(podEntity), tutorialLevels[1]);

    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(Order.get(tutorialLevels[1]).resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), Order.get(tutorialLevels[1]).resourceAmount);

    vm.stopPrank();
  }
}

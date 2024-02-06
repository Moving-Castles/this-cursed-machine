// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX, MATERIAL_TYPE } from "../../../src/codegen/common.sol";

contract OrderSystemTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] storageInPod;
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

    storageInPod = StorageInPod.get(podEntity);

    tutorialLevels = TutorialOrders.get();

    vm.stopPrank();
  }

  function testFill() public {
    setUp();

    vm.startPrank(alice);

    // Connect storage 0 to inlet
    world.connectStorage(storageInPod[0], MACHINE_TYPE.INLET);

    // Connect storage 1 to outlet
    world.connectStorage(storageInPod[1], MACHINE_TYPE.OUTLET);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (blood) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.SECOND);

    // Wait 4 blocks
    vm.roll(block.number + 4);

    // Disconnect storage and resolve
    world.disconnectStorage(MACHINE_TYPE.OUTLET);

    // 4 blocks passed
    assertEq(uint32(MaterialType.get(storageInPod[0])), uint32(MATERIAL_TYPE.BUG));
    // Inlet material spent => 4 * 100 = 400
    assertEq(Amount.get(storageInPod[0]), 1600); // 2000 - 400 = 0
    assertEq(uint32(MaterialType.get(storageInPod[1])), uint32(MATERIAL_TYPE.BLOOD));
    // Outlet material gained => 4 * 50 = 200
    assertEq(Amount.get(storageInPod[1]), 200); // 0 + 200 = 200

    // Order is fullfilled
    world.fill(storageInPod[1]);

    // Storage should be empty
    assertEq(uint32(MaterialType.get(storageInPod[1])), uint32(MATERIAL_TYPE.NONE));
    assertEq(Amount.get(storageInPod[1]), 0);

    // Order is set to second tutorial order
    assertEq(CurrentOrder.get(podEntity), tutorialLevels[1]);

    assertEq(uint32(MaterialType.get(storageInPod[0])), uint32(Order.get(tutorialLevels[1]).resourceMaterialType));
    assertEq(Amount.get(storageInPod[0]), Order.get(tutorialLevels[1]).resourceAmount);

    vm.stopPrank();
  }
}

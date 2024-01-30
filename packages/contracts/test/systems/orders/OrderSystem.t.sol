// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX, MATERIAL_TYPE } from "../../../src/codegen/common.sol";

contract OrderSystemTest is BaseTest {
  function testFill() public {
    setUp();

    vm.startPrank(alice);

    // Spawn player
    bytes32 playerEntity = world.spawn();
    world.start();

    bytes32 podEntity = CarriedBy.get(playerEntity);

    bytes32 inletEntity = InletEntity.get(podEntity);
    bytes32 outletEntity = OutletEntity.get(podEntity);

    bytes32[] memory storageInPod = StorageInPod.get(podEntity);

    // Connect dispenser to inlet
    bytes32 dispenserEntity = DispenserEntity.get(podEntity);
    world.connectStorage(dispenserEntity, MACHINE_TYPE.INLET);

    // Connect storage 1 to outlet
    world.connectStorage(storageInPod[1], MACHINE_TYPE.OUTLET);

    // Connect inlet to player
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    // Connect player to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Disconnect storage and resolve
    world.disconnectStorage(MACHINE_TYPE.OUTLET);

    // 3 blocks passed
    // Inlet material spent => 10 * 100 = 1000
    // Outlet material gained => 10 * 50 = 500
    assertEq(uint32(MaterialType.get(dispenserEntity)), uint32(MATERIAL_TYPE.NONE));
    assertEq(Amount.get(dispenserEntity), 0); // 1000 - 1000 = 0
    assertEq(uint32(MaterialType.get(storageInPod[1])), uint32(MATERIAL_TYPE.PISS));
    assertEq(Amount.get(storageInPod[1]), 500); // 0 + 500 = 500

    // Order is fullfilled
    world.fill(storageInPod[1]);

    // Storage should be empty
    assertEq(uint32(MaterialType.get(storageInPod[1])), uint32(MATERIAL_TYPE.NONE));
    assertEq(Amount.get(storageInPod[1]), 0);

    // Order is set to second tutorial order
    assertEq(CurrentOrder.get(podEntity), TutorialOrders.get()[1]);

    assertEq(uint32(MaterialType.get(dispenserEntity)), uint32(MATERIAL_TYPE.BUG));
    assertEq(Amount.get(dispenserEntity), 2000);

    vm.stopPrank();
  }
}

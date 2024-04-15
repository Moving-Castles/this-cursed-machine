// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../../../src/codegen/common.sol";

contract BuildSystemTest is BaseTest {
  function testBuild() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn("alice");
    world.start();

    // Create a new entity
    startGasReport("Build splitter");
    bytes32 machineEntity = world.build(MACHINE_TYPE.SPLITTER);
    endGasReport();

    vm.stopPrank();

    // Check that the machine was created
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(CarriedBy.get(machineEntity), CarriedBy.get(playerEntity));
  }

  function testRevertNotBuildable() public {
    setUp();

    vm.startPrank(alice);

    world.spawn("alice");
    world.start();

    // Create a new entity
    vm.expectRevert("not buildable");
    world.build(MACHINE_TYPE.PLAYER);

    vm.stopPrank();
  }

  function testBuildIndex() public {
    setUp();

    vm.startPrank(alice);

    world.spawn("alice");
    world.start();

    // Build splitter 1
    bytes32 splitter1 = world.build(MACHINE_TYPE.SPLITTER);
    assertEq(uint8(BuildIndex.get(splitter1)), 1);

    // Build splitter 2
    bytes32 splitter2 = world.build(MACHINE_TYPE.SPLITTER);
    assertEq(uint8(BuildIndex.get(splitter2)), 2);

    // Destroy splitter 1 & splitter 2
    world.destroy(splitter1);
    world.destroy(splitter2);

    // Build splitter 3
    bytes32 splitter3 = world.build(MACHINE_TYPE.SPLITTER);
    assertEq(uint8(BuildIndex.get(splitter3)), 3);

    vm.stopPrank();
  }
}

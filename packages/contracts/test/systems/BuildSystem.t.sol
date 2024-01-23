// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { BaseTest } from "../BaseTest.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../../src/codegen/common.sol";

contract BuildSystemTest is BaseTest {
  function testBuild() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.restart();

    // Create a new entity
    bytes32 machineEntity = world.build(MACHINE_TYPE.SPLITTER);

    vm.stopPrank();

    // Check that the machine was created
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(CarriedBy.get(machineEntity), CarriedBy.get(playerEntity));
  }

  function testRevertNotBuildable() public {
    setUp();

    vm.startPrank(alice);

    world.spawn();
    world.restart();

    // Create a new entity
    vm.expectRevert("not buildable");
    world.build(MACHINE_TYPE.PLAYER);

    vm.stopPrank();
  }
}

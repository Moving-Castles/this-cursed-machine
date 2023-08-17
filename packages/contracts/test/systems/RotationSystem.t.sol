// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, ROTATION } from "../../src/codegen/Types.sol";

contract RotationSystemTest is MudV2Test {
  function testRotate() public {
    setUp();

    vm.startPrank(alice);
    world.mc_SpawnSystem_spawn("Alice");
    vm.stopPrank();

    // Create a new entity
    vm.startPrank(alice);
    bytes32 machineEntity = world.mc_BuildSystem_build(MACHINE_TYPE.BLENDER, 1, 2, ROTATION.DEG0);
    vm.stopPrank();

    // Rotate entity
    vm.startPrank(alice);
    world.mc_RotateSystem_rotate(machineEntity, ROTATION.DEG270);
    vm.stopPrank();

    assertEq(uint8(Rotation.get(world, machineEntity)), uint8(ROTATION.DEG270));
  }
}

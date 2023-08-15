// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_TYPE, PORT_PLACEMENT, CONNECTION_TYPE } from "../../src/codegen/Types.sol";

contract BuildSystemTest is MudV2Test {
  function testBuild() public {
    setUp();

    vm.startPrank(alice);
    bytes32 boxEntity = world.mc_SpawnSystem_spawn("Alice");
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // Create a new entity
    vm.startPrank(alice);
    bytes32 machineEntity = world.mc_BuildSystem_build(MACHINE_TYPE.MIXER, 1, 2);
    vm.stopPrank();

    // Check that the machine was created
    assertEq(uint8(EntityType.get(world, machineEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(CarriedBy.get(world, machineEntity), CarriedBy.get(world, coreEntity));
    assertEq(Position.get(world, machineEntity).x, 1);
    assertEq(Position.get(world, machineEntity).y, 2);
  }
}

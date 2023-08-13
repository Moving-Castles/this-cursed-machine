// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE } from "../../src/codegen/Types.sol";

contract SpawnSystemTest is MudV2Test {
  function testSpawn() public {
    setUp();

    vm.startPrank(alice);
    bytes32 boxEntity = world.mc_SpawnSystem_spawn("Alice");
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // Check that the core was spawned correctly
    assertEq(uint8(EntityType.get(world, coreEntity)), uint8(ENTITY_TYPE.CORE));
    assertEq(Name.get(world, coreEntity), "Alice");
    assertEq(CreationBlock.get(world, coreEntity), block.number);
    assertEq(ReadyBlock.get(world, coreEntity), block.number);
    assertEq(CarriedBy.get(world, coreEntity), boxEntity);

    PositionData memory spawnPosition = Position.get(world, coreEntity);
    assertEq(spawnPosition.x, 2);
    assertEq(spawnPosition.y, 1);
  }

  // function testRevertRespawn() public {
  //   setUp();
  //   vm.startPrank(alice);
  //   world.mc_SpawnSystem_spawn("Alice");
  //   vm.expectRevert(bytes("already spawned"));
  //   world.mc_SpawnSystem_spawn("Alice");
  //   vm.stopPrank();
  // }

}

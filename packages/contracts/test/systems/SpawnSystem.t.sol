// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { EntityType } from "../../src/codegen/Types.sol";

contract SpawnSystemTest is MudV2Test {
  function testSpawn() public {
    setUp();

    vm.startPrank(alice);
    world.mc_SpawnSystem_spawn("Alice");
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // Check that the core was spawned correctly
    assertEq(uint8(Type.get(world, coreEntity)), uint8(EntityType.CORE));
    assertEq(Name.get(world, coreEntity), "Alice");
    assertEq(CreationBlock.get(world, coreEntity), block.number);
    assertEq(BodyId.get(world, coreEntity), 0);
    assertEq(Energy.get(world, coreEntity), gameConfig.coreInitialEnergy);
    assertEq(ReadyBlock.get(world, coreEntity), block.number);
    assertEq(StartBlock.get(world, coreEntity), 0);

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

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
    assertEq(RealmId.get(world, coreEntity), 0);
    assertEq(Energy.get(world, coreEntity), gameConfig.coreInitialEnergy);
    assertEq(ReadyBlock.get(world, coreEntity), block.number);
    assertEq(StartBlock.get(world, coreEntity), 0);

    PositionData memory spawnPosition = Position.get(world, coreEntity);
    assertEq(spawnPosition.x, 0);
    assertEq(spawnPosition.y, 1);
  }

  function testSpawnPositions() public {
    setUp();

    PositionData[4] memory spawnPositions = [
      PositionData(0, 0),
      PositionData(6, 0),
      PositionData(0, 6),
      PositionData(6, 6)
    ];

    vm.startPrank(alice);
    world.mc_SpawnSystem_spawn("Alice");
    vm.stopPrank();

    bytes32 aliceEntity = LibUtils.addressToEntityKey(alice);
    PositionData memory spawnPositionAlice = Position.get(world, aliceEntity);
    assertEq(spawnPositionAlice.x, spawnPositions[0].x);
    assertEq(spawnPositionAlice.y, spawnPositions[0].y);

    vm.roll(block.number + 10);

    vm.startPrank(bob);
    world.mc_SpawnSystem_spawn("Bob");
    vm.stopPrank();

    bytes32 bobEntity = LibUtils.addressToEntityKey(bob);
    PositionData memory spawnPositionBob = Position.get(world, bobEntity);
    assertEq(spawnPositionBob.x, spawnPositions[1].x);
    assertEq(spawnPositionBob.y, spawnPositions[1].y);
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

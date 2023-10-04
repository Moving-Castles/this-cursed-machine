// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../../src/codegen/common.sol";

contract SpawnSystemTest is MudTest {
  IWorld world;
  address internal alice;
  address internal bob;
  GameConfigData gameConfig;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
    gameConfig = GameConfig.get(world);
    alice = address(111);
    bob = address(222);
  }

  function testSpawn() public {
    setUp();

    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    vm.stopPrank();

    // Check that the core was spawned correctly
    assertEq(uint8(EntityType.get(world, coreEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(uint8(MachineType.get(world, coreEntity)), uint8(MACHINE_TYPE.CORE));
    assertEq(Level.get(world, coreEntity), 0);
    assertEq(CreationBlock.get(world, coreEntity), block.number);
    assertEq(ReadyBlock.get(world, coreEntity), block.number);
  }

  function testSpawnAndTransfer() public {
    setUp();

    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    bytes32 boxEntity = world.transfer();
    vm.stopPrank();

    assertEq(CarriedBy.get(world, coreEntity), boxEntity);
    assertEq(Level.get(world, coreEntity), 1);
    assertEq(Level.get(world, boxEntity), 1);
  }
}

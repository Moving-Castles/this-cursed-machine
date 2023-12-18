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
    gameConfig = GameConfig.get();
    alice = address(111);
    bob = address(222);
  }

  function testSpawn() public {
    setUp();

    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    vm.stopPrank();

    // Check that the core was spawned correctly
    assertEq(uint8(EntityType.get(coreEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(uint8(MachineType.get(coreEntity)), uint8(MACHINE_TYPE.CORE));
    assertEq(Level.get(coreEntity), 0);
    assertEq(Points.get(coreEntity), 1000);
    assertEq(CreationBlock.get(coreEntity), block.number);
    assertEq(IncomingConnections.get(coreEntity).length, 1);
    assertEq(OutgoingConnections.get(coreEntity).length, 2);
  }

  function testSpawnAndStart() public {
    setUp();

    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    bytes32 podEntity = world.restart();
    vm.stopPrank();

    assertEq(CarriedBy.get(coreEntity), podEntity);
    assertEq(Level.get(coreEntity), 1);
  }
}

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
    bytes32 playerEntity = world.spawn();
    vm.stopPrank();

    // Check that the player was spawned correctly
    assertEq(uint8(EntityType.get(playerEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(uint8(MachineType.get(playerEntity)), uint8(MACHINE_TYPE.PLAYER));
    assertEq(Level.get(playerEntity), 0);
    assertEq(CreationBlock.get(playerEntity), block.number);
    assertEq(IncomingConnections.get(playerEntity).length, 1);
    assertEq(OutgoingConnections.get(playerEntity).length, 2);
  }

  function testSpawnAndStart() public {
    setUp();

    vm.startPrank(alice);
    bytes32 playerEntity = world.spawn();
    bytes32 podEntity = world.restart();
    vm.stopPrank();

    assertEq(CarriedBy.get(playerEntity), podEntity);
    assertEq(Level.get(playerEntity), 1);
  }
}

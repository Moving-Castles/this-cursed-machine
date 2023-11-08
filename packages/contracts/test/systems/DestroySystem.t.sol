// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../../src/codegen/common.sol";

contract MachineSystemTest is MudTest {
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

  function testDestroy() public {
    setUp();

    vm.startPrank(alice);

    bytes32 coreEntity = world.spawn();
    world.restart();

    // Create a new entity

    bytes32 machineEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Check that the machine was created
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(CarriedBy.get(machineEntity), CarriedBy.get(coreEntity));

    // Destroy the machine
    world.destroy(machineEntity);

    vm.stopPrank();

    // Check that the machine was destroyed
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.NONE));
  }
}

// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_TYPE, PORT_PLACEMENT, CONNECTION_TYPE } from "../../src/codegen/common.sol";

contract BuildSystemTest is MudTest {
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

  function testBuild() public {
    setUp();

    vm.startPrank(alice);
    // world.mc_SpawnSystem_spawn();
    world.spawn();
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // Create a new entity
    vm.startPrank(alice);
    // bytes32 machineEntity = world.mc_BuildSystem_build(MACHINE_TYPE.BLENDER, 1, 2);
    bytes32 machineEntity = world.build(MACHINE_TYPE.BLENDER, 1, 2);
    vm.stopPrank();

    // Check that the machine was created
    assertEq(uint8(EntityType.get(world, machineEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(CarriedBy.get(world, machineEntity), CarriedBy.get(world, coreEntity));
    assertEq(Position.get(world, machineEntity).x, 1);
    assertEq(Position.get(world, machineEntity).y, 2);
  }
}

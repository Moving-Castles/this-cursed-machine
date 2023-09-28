// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, PORT_TYPE, CONNECTION_TYPE } from "../../src/codegen/common.sol";

contract TransferSystemTest is MudTest {
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

  function testTransfer() public {
    setUp();

    vm.startPrank(alice);
    // bytes32 spawnBoxEntity = world.mc_SpawnSystem_spawn();
    bytes32 spawnBoxEntity = world.spawn();
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    assertEq(Level.get(world, coreEntity), 0);

    vm.startPrank(alice);
    // bytes32 transferBoxEntity = world.mc_TransferSystem_transfer();
    bytes32 transferBoxEntity = world.transfer();
    vm.stopPrank();

    assertEq(Level.get(world, coreEntity), 1);

    assert(spawnBoxEntity != transferBoxEntity);
  }
}

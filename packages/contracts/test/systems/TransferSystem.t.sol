// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_INDEX } from "../../src/codegen/common.sol";

contract TransferSystemTest is MudTest {
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

  function testTransfer() public {
    setUp();

    vm.startPrank(alice);
    bytes32 playerEntity = world.spawn();
    world.restart();
    vm.stopPrank();

    assertEq(Level.get(playerEntity), 1);
  }

  function testRevertGoalsNotAchived() public {
    setUp();

    vm.startPrank(alice);
    bytes32 playerEntity = world.spawn();
    world.restart();

    assertEq(Level.get(playerEntity), 1);

    // Warp to level
    world.warp(2);

    vm.expectRevert("goals not achieved");
    world.transfer();

    vm.stopPrank();
  }

  function testDisconnectOutletOnTransfer() public {
    setUp();

    vm.startPrank(alice);
    bytes32 playerEntity = world.spawn();
    world.restart();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.INLET);
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.OUTLET);
    bytes32 outletEntity = outletEntities[0][0];

    assertEq(IncomingConnections.get(outletEntity).length, 1);

    // Connect player to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Connect inlet to player
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Transfer
    world.transfer();

    assertEq(Level.get(playerEntity), 2);

    // Check that the outlet is disconnected
    bytes32[] memory outletIncomingConnections = IncomingConnections.get(outletEntity);
    assertEq(outletIncomingConnections.length, 1);
    assertEq(outletIncomingConnections[0], bytes32(0));

    // Check that the player is disconnected from the outlet
    bytes32[] memory playerOutgoingConnections = OutgoingConnections.get(playerEntity);
    assertEq(playerOutgoingConnections.length, 2);
    assertEq(playerOutgoingConnections[0], bytes32(0));

    vm.stopPrank();
  }
}

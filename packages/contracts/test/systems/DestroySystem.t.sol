// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_INDEX } from "../../src/codegen/common.sol";

contract DestroySystemTest is MudTest {
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

    world.spawn();
    world.restart();

    // Create a new entity
    bytes32 machineEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Check that the machine was created
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.MACHINE));

    world.destroy(machineEntity);

    // Check that the machine was destroyed
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.NONE));

    vm.stopPrank();
  }

  function testDestroyConnections() public {
    setUp();

    vm.startPrank(alice);

    world.spawn();
    world.restart();

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Build a cooler
    bytes32 coolerEntity = world.build(MACHINE_TYPE.COOLER);

    // Connect splitter to cooler
    world.connect(splitterEntity, coolerEntity, PORT_INDEX.FIRST);

    // Destroy splitter
    world.destroy(splitterEntity);

    // Check that incoming connection is removed from cooler
    assertEq(IncomingConnections.get(coolerEntity)[0], bytes32(0));

    vm.stopPrank();
  }
}

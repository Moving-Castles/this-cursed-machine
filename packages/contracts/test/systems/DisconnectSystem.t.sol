// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../src/codegen/common.sol";

contract DiconnectSystemTest is MudTest {
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

  function testDisconnect() public {
    setUp();

    vm.startPrank(alice);

    bytes32 coreEntity = world.spawn();
    world.restart();

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Connect core (first output == piss) to splitter
    world.connect(coreEntity, splitterEntity, PORT_INDEX.FIRST);

    // Check that the connection was created
    assertEq(OutgoingConnections.get(coreEntity)[0], splitterEntity);
    assertEq(IncomingConnections.get(splitterEntity)[0], coreEntity);

    // Disconnect core from splitter
    world.disconnect(coreEntity, PORT_INDEX.FIRST);

    // Check that the connection was destroyed
    assertEq(OutgoingConnections.get(coreEntity)[0], bytes32(0));
    assertEq(IncomingConnections.get(splitterEntity)[0], bytes32(0));

    vm.stopPrank();
  }

  function testRevertNoConnection() public {
    setUp();

    vm.startPrank(alice);

    world.spawn();
    world.restart();

    // Build a splitter
    world.build(MACHINE_TYPE.SPLITTER);

    // Build a dryer
    bytes32 dryerEntity = world.build(MACHINE_TYPE.DRYER);

    // Connect dryer to splitter
    vm.expectRevert("no connection to disconnect");
    world.disconnect(dryerEntity, PORT_INDEX.FIRST);

    vm.stopPrank();
  }

  function testRevertInvalidMachine() public {
    setUp();

    vm.startPrank(alice);

    world.spawn();
    world.restart();

    // Disconnect null machine
    vm.expectRevert("outgoing index out of bounds");
    world.disconnect(bytes32(0), PORT_INDEX.FIRST);

    vm.stopPrank();
  }
}

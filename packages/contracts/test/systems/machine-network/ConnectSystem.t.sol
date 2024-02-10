// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";

contract ConnectSystemTest is BaseTest {
  function testConnect() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.start();

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Connect player (first output == piss) to splitter
    world.connect(playerEntity, splitterEntity, PORT_INDEX.FIRST);

    vm.stopPrank();

    // Check that the connection was created
    assertEq(OutgoingConnections.get(playerEntity)[0], splitterEntity);
    assertEq(IncomingConnections.get(splitterEntity)[0], playerEntity);
  }

  function testRevertNotSpawned() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.start();

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Destroy player
    world.destroy(playerEntity);

    // Connect player (first output == piss) to splitter
    vm.expectRevert("player not spawned");
    world.connect(playerEntity, splitterEntity, PORT_INDEX.FIRST);

    vm.stopPrank();
  }

  function testRevertNoInputs() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.start();

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Build a dryer
    bytes32 dryerEntity = world.build(MACHINE_TYPE.DRYER);

    // Connect player to splitter
    world.connect(playerEntity, splitterEntity, PORT_INDEX.FIRST);

    // Connect dryer to splitter
    vm.expectRevert("no available incoming ports");
    world.connect(dryerEntity, splitterEntity, PORT_INDEX.FIRST);

    vm.stopPrank();
  }

  function testRevertNoOutputs() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.start();

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Build a dryer
    bytes32 dryerEntity = world.build(MACHINE_TYPE.DRYER);

    // Connect dryer to splitter
    world.connect(dryerEntity, splitterEntity, PORT_INDEX.FIRST);

    // Connect dryer to player (dryer only has one output)
    vm.expectRevert("outgoing port already occupied");
    world.connect(dryerEntity, playerEntity, PORT_INDEX.FIRST);

    vm.stopPrank();
  }

  function testSelfConnect() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.start();

    // Connect player to self
    vm.expectRevert("source and target are same");
    world.connect(playerEntity, playerEntity, PORT_INDEX.FIRST);

    vm.stopPrank();
  }
}

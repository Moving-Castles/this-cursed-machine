// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { BaseTest } from "../BaseTest.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../src/codegen/common.sol";

contract DiconnectSystemTest is BaseTest {
  function testDisconnect() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.restart();

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Connect player (first output == piss) to splitter
    world.connect(playerEntity, splitterEntity, PORT_INDEX.FIRST);

    // Check that the connection was created
    assertEq(OutgoingConnections.get(playerEntity)[0], splitterEntity);
    assertEq(IncomingConnections.get(splitterEntity)[0], playerEntity);

    // Disconnect player from splitter
    world.disconnect(playerEntity, PORT_INDEX.FIRST);

    // Check that the connection was destroyed
    assertEq(OutgoingConnections.get(playerEntity)[0], bytes32(0));
    assertEq(IncomingConnections.get(splitterEntity)[0], bytes32(0));

    vm.stopPrank();
  }

  function testDisconnectSecondConnection() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.restart();

    // Build a mixer
    bytes32 mixerEntity = world.build(MACHINE_TYPE.MIXER);

    // Connect player (first output == piss) to mixer
    world.connect(playerEntity, mixerEntity, PORT_INDEX.FIRST);
    // Connect player (second output == blood) to mixer
    world.connect(playerEntity, mixerEntity, PORT_INDEX.SECOND);

    // Check that the connections were created
    assertEq(OutgoingConnections.get(playerEntity)[0], mixerEntity);
    assertEq(OutgoingConnections.get(playerEntity)[1], mixerEntity);
    assertEq(IncomingConnections.get(mixerEntity)[0], playerEntity);
    assertEq(IncomingConnections.get(mixerEntity)[1], playerEntity);

    // Disconnect player from mixer (blood)
    world.disconnect(playerEntity, PORT_INDEX.SECOND);

    // Check that the connection was destroyed
    assertEq(OutgoingConnections.get(playerEntity)[0], mixerEntity);
    assertEq(OutgoingConnections.get(playerEntity)[1], bytes32(0));
    assertEq(IncomingConnections.get(mixerEntity)[0], bytes32(0));
    assertEq(IncomingConnections.get(mixerEntity)[1], playerEntity);

    // Connect player (second output == blood) to mixer, again
    world.connect(playerEntity, mixerEntity, PORT_INDEX.SECOND);

    // Check that the connections were created
    assertEq(OutgoingConnections.get(playerEntity)[0], mixerEntity);
    assertEq(OutgoingConnections.get(playerEntity)[1], mixerEntity);
    assertEq(IncomingConnections.get(mixerEntity)[0], playerEntity);
    assertEq(IncomingConnections.get(mixerEntity)[1], playerEntity);

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

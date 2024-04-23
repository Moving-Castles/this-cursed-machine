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

    bytes32 playerEntity = world.spawn("alice");
    world.start();

    // Build a splitter
    bytes32 splitterEntity = world.buildMachine(MACHINE_TYPE.SPLITTER);

    // Connect player (first output == piss) to splitter
    startGasReport("Connect");
    world.connect(playerEntity, splitterEntity, PORT_INDEX.FIRST);
    endGasReport();

    vm.stopPrank();

    // Check that the connection was created
    assertEq(OutgoingConnections.get(playerEntity)[0], splitterEntity);
    assertEq(IncomingConnections.get(splitterEntity)[0], playerEntity);
  }

  function testRevertNoInputs() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn("alice");
    world.start();

    // Build a splitter
    bytes32 splitterEntity = world.buildMachine(MACHINE_TYPE.SPLITTER);

    // Build a dryer
    bytes32 dryerEntity = world.buildMachine(MACHINE_TYPE.DRYER);

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

    bytes32 playerEntity = world.spawn("alice");
    world.start();

    // Build a splitter
    bytes32 splitterEntity = world.buildMachine(MACHINE_TYPE.SPLITTER);

    // Build a dryer
    bytes32 dryerEntity = world.buildMachine(MACHINE_TYPE.DRYER);

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

    bytes32 playerEntity = world.spawn("alice");
    world.start();

    // Connect dryer to splitter
    vm.expectRevert("source and target are same");
    world.connect(playerEntity, playerEntity, PORT_INDEX.FIRST);

    vm.stopPrank();
  }
}

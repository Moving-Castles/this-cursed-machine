// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../src/codegen/common.sol";

contract ConnectSystemTest is MudTest {
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

  function testConnect() public {
    setUp();

    vm.startPrank(alice);

    bytes32 coreEntity = world.spawn();
    world.restart();

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Connect core (first output == piss) to splitter
    world.connect(coreEntity, splitterEntity, PORT_INDEX.FIRST);

    vm.stopPrank();

    // Check that the connection was created
    assertEq(OutgoingConnections.get(coreEntity)[0], splitterEntity);
    assertEq(IncomingConnections.get(splitterEntity)[0], coreEntity);
  }

  function testRevertNoInputs() public {
    setUp();

    vm.startPrank(alice);

    bytes32 coreEntity = world.spawn();
    world.restart();

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Build a dryer
    bytes32 dryerEntity = world.build(MACHINE_TYPE.DRYER);

    // Connect core to splitter
    world.connect(coreEntity, splitterEntity, PORT_INDEX.FIRST);

    // Connect dryer to splitter
    vm.expectRevert("no available incoming ports");
    world.connect(dryerEntity, splitterEntity, PORT_INDEX.FIRST);

    vm.stopPrank();
  }

  function testRevertNoOutputs() public {
    setUp();

    vm.startPrank(alice);

    bytes32 coreEntity = world.spawn();
    world.restart();

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Build a dryer
    bytes32 dryerEntity = world.build(MACHINE_TYPE.DRYER);

    // Connect dryer to splitter
    world.connect(dryerEntity, splitterEntity, PORT_INDEX.FIRST);

    // Connect dryer to core (dryer only has one output)
    vm.expectRevert("outgoing port already occupied");
    world.connect(dryerEntity, coreEntity, PORT_INDEX.FIRST);

    vm.stopPrank();
  }
}

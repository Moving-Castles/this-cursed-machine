// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";

contract DestroySystemTest is BaseTest {
  function testDestroy() public {
    setUp();

    vm.startPrank(alice);

    world.spawn();
    world.start();

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
    world.start();

    // Build a dryer
    bytes32 dryerEntity = world.build(MACHINE_TYPE.DRYER);

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Build a cooler
    bytes32 coolerEntity = world.build(MACHINE_TYPE.COOLER);

    // Connect dryer to splitter
    world.connect(dryerEntity, splitterEntity, PORT_INDEX.FIRST);

    // Connect splitter to cooler
    world.connect(splitterEntity, coolerEntity, PORT_INDEX.FIRST);

    // Destroy splitter
    world.destroy(splitterEntity);

    // Check that incoming connection is removed from cooler
    assertEq(IncomingConnections.get(coolerEntity)[0], bytes32(0));

    // Check that outgoing connection is removed from dryer
    assertEq(IncomingConnections.get(dryerEntity)[0], bytes32(0));

    vm.stopPrank();
  }

  function testDestroyPlayer() public {
    setUp();

    vm.startPrank(alice);

    world.spawn();
    world.start();

    bytes32 playerEntity = LibUtils.addressToEntityKey(alice);

    // Destroy player
    world.destroy(playerEntity);

    // Check that the machine was destroyed
    assertEq(uint8(EntityType.get(playerEntity)), uint8(ENTITY_TYPE.NONE));

    // Build a dryer
    vm.expectRevert("player not spawned");
    world.build(MACHINE_TYPE.SPLITTER);
  }
}

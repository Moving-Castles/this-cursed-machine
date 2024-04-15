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

    world.spawn("alice");
    world.start();

    // Create a new entity
    bytes32 machineEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Check that the machine was created
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.MACHINE));

    startGasReport("Destroy splitter");
    world.destroy(machineEntity);
    endGasReport();

    // Check that the machine was destroyed
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.NONE));

    vm.stopPrank();
  }

  function testDestroyConnections() public {
    setUp();

    vm.startPrank(alice);

    world.spawn("alice");
    world.start();

    // Build a dryer
    bytes32 dryerEntity = world.build(MACHINE_TYPE.DRYER);

    // Build a splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Build a boiler
    bytes32 boilerEntity = world.build(MACHINE_TYPE.BOILER);

    // Connect dryer to splitter
    world.connect(dryerEntity, splitterEntity, PORT_INDEX.FIRST);

    // Connect splitter to cooler
    world.connect(splitterEntity, boilerEntity, PORT_INDEX.FIRST);

    // Destroy splitter
    world.destroy(splitterEntity);

    // Check that incoming connection is removed from cooler
    assertEq(IncomingConnections.get(boilerEntity)[0], bytes32(0));

    // Check that outgoing connection is removed from dryer
    assertEq(IncomingConnections.get(dryerEntity)[0], bytes32(0));

    vm.stopPrank();
  }
}

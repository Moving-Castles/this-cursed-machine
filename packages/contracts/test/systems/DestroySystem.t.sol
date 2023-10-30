// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_TYPE } from "../../src/codegen/common.sol";

contract MachineSystemTest is MudTest {
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
    bytes32 coreEntity = world.spawn();
    world.transfer();
    vm.stopPrank();

    // Create a new entity
    vm.startPrank(alice);
    bytes32 machineEntity = world.build(MACHINE_TYPE.SPLITTER);
    vm.stopPrank();

    // Check that the machine was created
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(CarriedBy.get(machineEntity), CarriedBy.get(coreEntity));

    // Destroy the machine
    vm.startPrank(alice);
    world.destroy(machineEntity);
    vm.stopPrank();

    // Check that the machine was destroyed
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.NONE));
  }

  function testDestroyConnection() public {
    setUp();

    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    world.transfer();
    vm.stopPrank();

    // Create a new entity
    vm.startPrank(alice);
    bytes32 machineEntity = world.build(MACHINE_TYPE.SPLITTER);
    vm.stopPrank();

    // Get output port on core
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(coreEntity, PORT_TYPE.OUTPUT);
    // Get input port on entity
    bytes32[][] memory machineInputPorts = LibPort.getPorts(machineEntity, PORT_TYPE.INPUT);
    // Connect core to entity
    vm.startPrank(alice);
    bytes32 connection = world.connect(coreOutputPorts[0][0], machineInputPorts[0][0]);
    vm.stopPrank();

    // Check that the connection was created
    assertEq(uint8(EntityType.get(connection)), uint8(ENTITY_TYPE.CONNECTION));
    assertEq(SourcePort.get(connection), coreOutputPorts[0][0]);
    assertEq(TargetPort.get(connection), machineInputPorts[0][0]);

    // Destroy the machine
    vm.startPrank(alice);
    world.destroy(machineEntity);
    vm.stopPrank();

    // Check that the machine was destroyed
    assertEq(uint8(EntityType.get(machineEntity)), uint8(ENTITY_TYPE.NONE));
    // Check that the port was destroyed
    assertEq(uint8(EntityType.get(machineInputPorts[0][0])), uint8(ENTITY_TYPE.NONE));
    // Check that the connection was destroyed
    assertEq(uint8(EntityType.get(connection)), uint8(ENTITY_TYPE.NONE));
  }
}

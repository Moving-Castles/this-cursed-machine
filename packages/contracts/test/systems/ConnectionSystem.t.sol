// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_TYPE, PORT_PLACEMENT, CONNECTION_TYPE, ROTATION } from "../../src/codegen/Types.sol";

contract ConnectionSystemTest is MudV2Test {
  function testConnect() public {
    setUp();

    vm.startPrank(alice);
    bytes32 boxEntity = world.mc_SpawnSystem_spawn("Alice");
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // Create a new entity
    vm.startPrank(alice);
    bytes32 newEntity = world.mc_BuildSystem_build(MACHINE_TYPE.MIXER, 1, 2, ROTATION.DEG0);
    vm.stopPrank();

    // Add input port to new entity
    // TODO: This should be done by the build system, and function should be added to get ports connected to entity
    bytes32 inputPort = LibUtils.getRandomKey();
    world.mc_DevSystem_set(EntityTypeTableId, inputPort, abi.encodePacked(ENTITY_TYPE.PORT));
    world.mc_DevSystem_set(CreationBlockTableId, inputPort, abi.encodePacked(block.number));
    world.mc_DevSystem_set(PortTypeTableId, inputPort, abi.encodePacked(PORT_TYPE.INPUT));
    world.mc_DevSystem_set(PortPlacementTableId, inputPort, abi.encodePacked(PORT_PLACEMENT.RIGHT));
    world.mc_DevSystem_set(CarriedByTableId, inputPort, abi.encodePacked(newEntity));

    // Add out port to core
    bytes32 outputPort = LibUtils.getRandomKey();
    world.mc_DevSystem_set(EntityTypeTableId, outputPort, abi.encodePacked(ENTITY_TYPE.PORT));
    world.mc_DevSystem_set(CreationBlockTableId, outputPort, abi.encodePacked(block.number));
    world.mc_DevSystem_set(PortTypeTableId, outputPort, abi.encodePacked(PORT_TYPE.OUTPUT));
    world.mc_DevSystem_set(PortPlacementTableId, outputPort, abi.encodePacked(PORT_PLACEMENT.LEFT));
    world.mc_DevSystem_set(CarriedByTableId, outputPort, abi.encodePacked(coreEntity));

    // Connect
    vm.startPrank(alice);
    bytes32 connection = world.mc_ConnectionSystem_connect(CONNECTION_TYPE.RESOURCE, outputPort, inputPort);
    vm.stopPrank();

    // Check that the connection was created
    assertEq(uint8(EntityType.get(world, connection)), uint8(ENTITY_TYPE.CONNECTION));
    assertEq(SourcePort.get(world, connection), outputPort);
    assertEq(TargetPort.get(world, connection), inputPort);
  }
}

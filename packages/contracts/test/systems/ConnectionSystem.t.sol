// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_TYPE, PORT_PLACEMENT, CONNECTION_TYPE } from "../../src/codegen/Types.sol";

contract ConnectionSystemTest is MudV2Test {
  function testConnect() public {
    setUp();

    vm.startPrank(alice);
    bytes32 boxEntity = world.mc_SpawnSystem_spawn("Alice");
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // Create a new entity
    bytes32 newEntity = LibUtils.getRandomKey();
    world.mc_DevSystem_set(EntityTypeTableId, newEntity, abi.encodePacked(ENTITY_TYPE.MACHINE));
    world.mc_DevSystem_set(MachineTypeTableId, newEntity, abi.encodePacked(MACHINE_TYPE.MIXER));
    world.mc_DevSystem_set(CreationBlockTableId, newEntity, abi.encodePacked(block.number));
    world.mc_DevSystem_set(CarriedByTableId, newEntity, abi.encodePacked(boxEntity));
    world.mc_DevSystem_set(PositionTableId, newEntity, 1, 2);

    // Add input port to new entity
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

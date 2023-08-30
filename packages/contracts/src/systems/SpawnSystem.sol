// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, Rotation, ClaimBlock, CreationBlock, Active, Width, Height, Level, MinCores, MaxCores, EntityType, Position, PositionData, CarriedBy, GameConfig, GameConfigData } from "../codegen/Tables.sol";
import { ENTITY_TYPE, PORT_TYPE, PORT_PLACEMENT, MACHINE_TYPE, ROTATION, CONNECTION_TYPE } from "../codegen/Types.sol";
import { LibUtils, LibBox, LibCore, LibPort, LibEntity, LibConnection } from "../libraries/Libraries.sol";

contract SpawnSystem is System {
  function spawn(string memory _name) public returns (bytes32) {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // TODO: check if already spawned

    // Create box entity
    bytes32 boxEntity = LibBox.create(0, 6, 6, 1, 1, true);

    // Create Inlet
    bytes32 inletEntity = LibEntity.create(MACHINE_TYPE.INLET);
    Position.set(inletEntity, PositionData(3, 5));
    Rotation.set(inletEntity, ROTATION.DEG0);
    CarriedBy.set(inletEntity, boxEntity);
    bytes32 inletOutput = LibPort.create(inletEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.TOP);

    // Create core entity
    LibCore.spawn(coreEntity, 0, _name);

    // Place core in box
    CarriedBy.set(coreEntity, boxEntity);
    Position.set(coreEntity, PositionData(2, 1));

    // Create ports on core
    bytes32 coreInput = LibPort.create(coreEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.LEFT);
    bytes32 coreOutputPiss = LibPort.create(coreEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.RIGHT);
    bytes32 coreOutputBlood = LibPort.create(coreEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.RIGHT);

    // Create Outlet
    bytes32 outletEntity = LibEntity.create(MACHINE_TYPE.OUTLET);
    Position.set(outletEntity, PositionData(1, 0));
    Rotation.set(outletEntity, ROTATION.DEG0);
    CarriedBy.set(outletEntity, boxEntity);
    bytes32 outletInput = LibPort.create(outletEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.BOTTOM);

    // Connect inlet output to core input
    LibConnection.create(inletOutput, coreInput, CONNECTION_TYPE.RESOURCE);

    // Connect core output to outlet input
    LibConnection.create(coreOutputPiss, outletInput, CONNECTION_TYPE.RESOURCE);

    // Create test machine entity
    // bytes32 machineEntity = LibEntity.create(MACHINE_TYPE.BLENDER);
    // CarriedBy.set(machineEntity, CarriedBy.get(coreEntity));
    // Position.set(machineEntity, PositionData(1, 2));
    // Rotation.set(machineEntity, ROTATION.DEG0);

    // Create ports on test machine
    // LibPort.create(machineEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.LEFT);
    // LibPort.create(machineEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.RIGHT);
    // LibPort.create(machineEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.LEFT);
    // LibPort.create(machineEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.RIGHT);

    return boxEntity;
  }
}

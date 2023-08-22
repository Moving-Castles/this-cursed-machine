// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, Rotation, ClaimBlock, CreationBlock, Active, Width, Height, Level, MinCores, MaxCores, EntityType, Position, PositionData, CarriedBy, GameConfig, GameConfigData } from "../codegen/Tables.sol";
import { ENTITY_TYPE, PORT_TYPE, PORT_PLACEMENT, MACHINE_TYPE, ROTATION } from "../codegen/Types.sol";
import { LibUtils, LibBox, LibCore, LibPort, LibEntity } from "../libraries/Libraries.sol";

contract SpawnSystem is System {
  function spawn(string memory _name) public returns (bytes32) {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // TODO: check if already spawned

    // Create box entity
    bytes32 boxEntity = LibBox.create(0, 4, 4, 1, 1, true);

    // Create core entity
    LibCore.spawn(coreEntity, 0, _name);

    // Place core in box
    CarriedBy.set(coreEntity, boxEntity);
    Position.set(coreEntity, PositionData(2, 1));

    // Create ports on core
    LibPort.create(coreEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.LEFT);
    LibPort.create(coreEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.RIGHT);

    // Create test machine entity
    // bytes32 machineEntity = LibEntity.create(MACHINE_TYPE.BLENDER);
    // CarriedBy.set(machineEntity, CarriedBy.get(coreEntity));
    // Position.set(machineEntity, PositionData(1, 2));
    // Rotation.set(machineEntity, ROTATION.DEG0);

    // Create ports on test machine
    // LibPort.create(machineEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.LEFT);
    // LibPort.create(machineEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.RIGHT);

    return boxEntity;
  }
}

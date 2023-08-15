// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, EntityType, GameConfig, GameConfigData, CarriedBy, Position, PositionData } from "../codegen/Tables.sol";
import { ENTITY_TYPE, CONNECTION_TYPE, PORT_TYPE, MACHINE_TYPE, PORT_PLACEMENT } from "../codegen/Types.sol";
import { LibUtils, LibConnection, LibEntity, LibPort } from "../libraries/Libraries.sol";

contract BuildSystem is System {
  function build(MACHINE_TYPE _machineType, int32 _x, int32 _y) public returns (bytes32) {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // ...
    require(ReadyBlock.get(coreEntity) >= block.number, "core in cooldown");
    // TOOD: Check that position is valid and unoccupied
    // TODO: Cost
    // ...

    // Create machine entity
    bytes32 machineEntity = LibEntity.create(_machineType);
    CarriedBy.set(machineEntity, CarriedBy.get(coreEntity));
    Position.set(machineEntity, PositionData(_x, _y));

    // Create ports on machine
    LibPort.create(machineEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.LEFT);
    LibPort.create(machineEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.RIGHT);

    return machineEntity;
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, EntityType, GameConfig, GameConfigData, Energy, CarriedBy, Position, PositionData, Rotation } from "../codegen/Tables.sol";
import { ENTITY_TYPE, CONNECTION_TYPE, PORT_TYPE, MACHINE_TYPE, PORT_PLACEMENT, ROTATION } from "../codegen/Types.sol";
import { LibUtils, LibConnection, LibEntity, LibPort, LibNetwork } from "../libraries/Libraries.sol";

contract BuildSystem is System {
  function build(MACHINE_TYPE _machineType, int32 _x, int32 _y, ROTATION _rotation) public returns (bytes32) {
    GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // ...
    require(ReadyBlock.get(coreEntity) <= block.number, "core in cooldown");
    require(Energy.get(coreEntity) >= gameConfig.buildCost, "insufficient energy");
    // TOOD: Check that position is valid and unoccupied
    // ...

    LibNetwork.resolve(CarriedBy.get(coreEntity));

    // Create machine entity
    bytes32 machineEntity = LibEntity.create(_machineType);
    CarriedBy.set(machineEntity, CarriedBy.get(coreEntity));
    Position.set(machineEntity, PositionData(_x, _y));
    Rotation.set(machineEntity, _rotation);

    // Create ports on machine
    LibPort.create(machineEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.TOP);
    LibPort.create(machineEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.LEFT);
    LibPort.create(machineEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.RIGHT);
    LibPort.create(machineEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.BOTTOM);

    // Deduct energy
    Energy.set(coreEntity, Energy.get(coreEntity) - gameConfig.buildCost);

    return machineEntity;
  }
}

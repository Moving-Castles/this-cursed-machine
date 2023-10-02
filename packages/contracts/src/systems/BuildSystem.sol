// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { ReadyBlock, GameConfig, GameConfigData, Energy, CarriedBy } from "../codegen/index.sol";
import { PORT_TYPE, MACHINE_TYPE, PORT_PLACEMENT } from "../codegen/common.sol";
import { LibUtils, LibEntity, LibPort, LibNetwork } from "../libraries/Libraries.sol";

contract BuildSystem is System {
  function build(MACHINE_TYPE _machineType) public returns (bytes32) {
    GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(ReadyBlock.get(coreEntity) <= block.number, "core in cooldown");
    require(Energy.get(coreEntity) >= gameConfig.buildCost, "insufficient energy");

    // Resolve network
    LibNetwork.resolve(CarriedBy.get(coreEntity));

    // Create machine entity
    bytes32 machineEntity = LibEntity.create(_machineType);
    CarriedBy.set(machineEntity, CarriedBy.get(coreEntity));

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

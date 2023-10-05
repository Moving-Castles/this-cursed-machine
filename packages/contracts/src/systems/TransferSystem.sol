// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, GameConfig, GameConfigData } from "../codegen/index.sol";
import { PORT_TYPE, PORT_PLACEMENT, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibBox, LibPort, LibEntity } from "../libraries/Libraries.sol";

contract TransferSystem is System {
  function transfer() public returns (bytes32) {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());

    uint32 newLevel = Level.get(coreEntity) + 1;

    // Level up core entity
    Level.set(coreEntity, newLevel);

    // Create box entity
    bytes32 boxEntity = LibBox.create(newLevel);

    // Create Inlet
    bytes32 inletEntity = LibEntity.create(MACHINE_TYPE.INLET);
    CarriedBy.set(inletEntity, boxEntity);
    LibPort.create(inletEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.TOP);

    // Place core in box
    CarriedBy.set(coreEntity, boxEntity);

    // Create ports on core
    LibPort.create(coreEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.LEFT);
    LibPort.create(coreEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.RIGHT);
    LibPort.create(coreEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.RIGHT);

    // Create Outlet
    bytes32 outletEntity = LibEntity.create(MACHINE_TYPE.OUTLET);
    CarriedBy.set(outletEntity, boxEntity);
    LibPort.create(outletEntity, PORT_TYPE.INPUT, PORT_PLACEMENT.BOTTOM);

    // TODO: destroy old box

    return boxEntity;
  }
}

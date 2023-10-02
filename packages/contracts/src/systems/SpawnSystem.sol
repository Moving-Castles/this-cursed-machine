// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { CarriedBy, GameConfig, GameConfigData } from "../codegen/index.sol";
import { PORT_TYPE, PORT_PLACEMENT, MACHINE_TYPE, CONNECTION_TYPE } from "../codegen/common.sol";
import { LibUtils, LibBox, LibCore, LibPort, LibEntity, LibConnection } from "../libraries/Libraries.sol";

contract SpawnSystem is System {
  function spawn() public returns (bytes32) {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // TODO: check if already spawned

    // Create box entity
    bytes32 boxEntity = LibBox.create(0);

    // Create Inlet
    bytes32 inletEntity = LibEntity.create(MACHINE_TYPE.INLET);
    CarriedBy.set(inletEntity, boxEntity);
    LibPort.create(inletEntity, PORT_TYPE.OUTPUT, PORT_PLACEMENT.TOP);

    // Create core entity
    LibCore.spawn(coreEntity, 0);

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

    bytes32[][] memory ports = LibPort.getPorts(coreEntity, PORT_TYPE.INPUT);
    console.log("ports.length");
    console.log(ports.length);

    return boxEntity;
  }
}

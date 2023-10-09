// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, Energy } from "../codegen/index.sol";
import { PORT_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibBox, LibPort, LibEntity } from "../libraries/Libraries.sol";

contract TransferSystem is System {
  /**
   * @notice Transfers, levels up the core entity, and rearranges entities within a new box configuration.
   * @return boxEntity The identifier of the newly created box entity.
   * @dev Ensure the proper deletion of the old box in future versions.
   */
  function transfer() public returns (bytes32) {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());

    uint32 newLevel = Level.get(coreEntity) + 1;

    // Level up core entity
    Level.set(coreEntity, newLevel);

    // Set initial energy
    // @todo Set energy based on level
    Energy.set(coreEntity, 100);

    // Create box entity
    bytes32 boxEntity = LibBox.create(newLevel);

    // Create Inlet
    bytes32 inletEntity = LibEntity.create(MACHINE_TYPE.INLET);
    CarriedBy.set(inletEntity, boxEntity);
    LibPort.create(inletEntity, PORT_TYPE.OUTPUT);

    // Place core in box
    CarriedBy.set(coreEntity, boxEntity);

    // Create ports on core
    LibPort.create(coreEntity, PORT_TYPE.INPUT);
    LibPort.create(coreEntity, PORT_TYPE.OUTPUT);
    LibPort.create(coreEntity, PORT_TYPE.OUTPUT);

    // Create Outlet
    bytes32 outletEntity = LibEntity.create(MACHINE_TYPE.OUTLET);
    CarriedBy.set(outletEntity, boxEntity);
    LibPort.create(outletEntity, PORT_TYPE.INPUT);

    // @todo Destroy old box

    return boxEntity;
  }

  /**
   * @notice Restarts and reconfigures the core entity, setting it back to level 1 and rearranging associated entities within a new box.
   * @return boxEntity The identifier of the newly created box entity.
   * @dev Ensure dynamic energy setting based on level and implement the deletion of the old box in future versions.
   */
  function restart() public returns (bytes32) {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());

    // Return to level 1
    Level.set(coreEntity, 1);

    // Set initial energy
    // @todo Set energy based on level
    Energy.set(coreEntity, 100);

    // Create box entity
    bytes32 boxEntity = LibBox.create(1);

    // Create Inlet
    bytes32 inletEntity = LibEntity.create(MACHINE_TYPE.INLET);
    CarriedBy.set(inletEntity, boxEntity);
    LibPort.create(inletEntity, PORT_TYPE.OUTPUT);

    // Place core in box
    CarriedBy.set(coreEntity, boxEntity);

    // Create ports on core
    LibPort.create(coreEntity, PORT_TYPE.INPUT);
    LibPort.create(coreEntity, PORT_TYPE.OUTPUT);
    LibPort.create(coreEntity, PORT_TYPE.OUTPUT);

    // Create Outlet
    bytes32 outletEntity = LibEntity.create(MACHINE_TYPE.OUTLET);
    CarriedBy.set(outletEntity, boxEntity);
    LibPort.create(outletEntity, PORT_TYPE.INPUT);

    // @todo Destroy old box

    return boxEntity;
  }
}

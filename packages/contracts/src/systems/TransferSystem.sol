// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, Energy } from "../codegen/index.sol";
import { PORT_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibBox, LibPort, LibEntity, LibLevel, LibGoal, LibNetwork } from "../libraries/Libraries.sol";

contract TransferSystem is System {
  /**
   * @notice Transfers, levels up the core entity, and rearranges entities within a new box configuration.
   * @return boxEntity The identifier of the newly created box entity.
   * @dev Ensure the proper deletion of the old box in future versions.
   */
  function transfer() public returns (bytes32) {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());

    // Resolve network if we are in pod
    if (CarriedBy.get(coreEntity) != bytes32(0)) {
      LibNetwork.resolve(CarriedBy.get(coreEntity));
    }

    // Check goals
    require(LibGoal.goalsAreAchived(coreEntity), "goals not achieved");

    // Level up core entity
    uint32 newLevel = Level.get(coreEntity) + 1;
    // uint32 newLevel;
    // if (Level.get(coreEntity) == 0) {
    //   newLevel = 7;
    // } else {
    //   newLevel = Level.get(coreEntity) + 1;
    // }
    Level.set(coreEntity, newLevel);

    if (newLevel == 1) {
      // Core is at level 1, enter the pod

      // Set initial energy
      bytes32 levelEntity = LibLevel.getLevel(newLevel);
      Energy.set(coreEntity, Energy.get(levelEntity));

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

      // Return box
      return boxEntity;
    } else if (newLevel == 8) {
      // Core is at level 8, progression done
      // Remove core from box
      CarriedBy.deleteRecord(coreEntity);
      // @todo Destroy old box
      // @todo Transfer materials to warehouse
      // Return null-pod
      return bytes32(0);
    } else {
      // Core is at level 2-8
      // Level up box
      Level.set(CarriedBy.get(coreEntity), newLevel);
      // Return box
      return CarriedBy.get(coreEntity);
    }
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

    // Destroy all ports on core
    bytes32[][] memory coreInputs = LibPort.getPorts(coreEntity, PORT_TYPE.INPUT);
    for (uint256 i = 0; i < coreInputs.length; i++) {
      LibPort.destroy(coreInputs[i][0]);
    }
    bytes32[][] memory coreOutputs = LibPort.getPorts(coreEntity, PORT_TYPE.OUTPUT);
    for (uint256 i = 0; i < coreOutputs.length; i++) {
      LibPort.destroy(coreOutputs[i][0]);
    }

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

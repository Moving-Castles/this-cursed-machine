// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { PortType, CarriedBy, EntityType, MachineType, BuildIndex } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";

library LibEntity {
  /**
   * @notice Creates a new machine entity of the specified type.
   * @param _machineType The type of machine to create, specified by the MACHINE_TYPE enum.
   * @return entity The identifier for the newly created machine entity.
   */
  function create(MACHINE_TYPE _machineType) internal returns (bytes32) {
    bytes32 entity = LibUtils.getRandomKey();
    EntityType.set(entity, ENTITY_TYPE.MACHINE);
    MachineType.set(entity, _machineType);
    return entity;
  }

  /**
   * @notice Deletes the records associated with a specified entity.
   * @param _entity The identifier for the entity whose records are to be deleted.
   */
  function destroy(bytes32 _entity) internal {
    EntityType.deleteRecord(_entity);
    MachineType.deleteRecord(_entity);
    BuildIndex.deleteRecord(_entity);
  }

  /**
   * @notice Checks if the specified machine type is considered buildable.
   * @param _machineType The type of machine to verify, dictated by the MACHINE_TYPE enum.
   * @return bool True if the machine type is among the predefined buildable types, false otherwise.
   */
  function isBuildableMachineType(MACHINE_TYPE _machineType) internal pure returns (bool) {
    MACHINE_TYPE[6] memory buildableMachineTypes = [
      MACHINE_TYPE.SPLITTER,
      MACHINE_TYPE.MIXER,
      MACHINE_TYPE.DRYER,
      MACHINE_TYPE.WETTER,
      MACHINE_TYPE.BOILER,
      MACHINE_TYPE.COOLER
    ];

    for (uint i = 0; i < buildableMachineTypes.length; i++) {
      if (_machineType == buildableMachineTypes[i]) {
        return true;
      }
    }
    return false;
  }
}

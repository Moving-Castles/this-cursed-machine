// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, MachineType, BuildIndex, IncomingConnections, OutgoingConnections } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";

library LibEntity {
  /**
   * @notice Creates a new machine entity of the specified type.
   * @param _machineType The type of machine to create, specified by the MACHINE_TYPE enum.
   * @return entity The identifier for the newly created machine entity.
   */
  function create(MACHINE_TYPE _machineType) internal returns (bytes32) {
    bytes32 entity = getUniqueEntity();
    EntityType.set(entity, ENTITY_TYPE.MACHINE);
    MachineType.set(entity, _machineType);

    // Set ports on machine
    // - - - - - - - - - - - - -
    // NONE:          0 IN, 0 OUT
    // INLET:         0 IN, 1 OUT
    // OUTLET:        1 IN, 0 OUT
    // PLAYER:        1 IN, 2 OUT (created at spawn)
    // SPLITTER:      1 IN, 2 OUT
    // MIXER:         2 IN, 1 OUT
    // DRYER:         1 IN, 1 OUT
    // BOILER:        1 IN, 1 OUT
    // CENTRIFUGE:    1 IN, 2 OUT
    // GRINDER:       1 IN, 2 OUT
    // RAT_CAGE:      1 IN, 2 OUT
    // MEALWORM_VAT:  1 IN, 2 OUT

    if (_machineType == MACHINE_TYPE.INLET) {
      // 0 IN, 1 OUT
      IncomingConnections.set(entity, new bytes32[](0));
      OutgoingConnections.set(entity, new bytes32[](1));
    } else if (_machineType == MACHINE_TYPE.OUTLET) {
      // 1 IN, 0 OUT
      IncomingConnections.set(entity, new bytes32[](1));
      OutgoingConnections.set(entity, new bytes32[](0));
    } else if (_machineType == MACHINE_TYPE.MIXER) {
      // 2 IN, 1 OUT
      IncomingConnections.set(entity, new bytes32[](2));
      OutgoingConnections.set(entity, new bytes32[](1));
    } else if (_machineType == MACHINE_TYPE.DRYER || _machineType == MACHINE_TYPE.BOILER) {
      // 1 IN, 1 OUT
      IncomingConnections.set(entity, new bytes32[](1));
      OutgoingConnections.set(entity, new bytes32[](1));
    } else {
      // 1 IN, 2 OUT
      IncomingConnections.set(entity, new bytes32[](1));
      OutgoingConnections.set(entity, new bytes32[](2));
    }

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
    IncomingConnections.deleteRecord(_entity);
    OutgoingConnections.deleteRecord(_entity);
  }

  /**
   * @notice Checks if the specified machine type is considered buildable.
   * @param _machineType The type of machine to verify, dictated by the MACHINE_TYPE enum.
   * @return bool True if the machine type is among the predefined buildable types, false otherwise.
   */
  function isBuildableMachineType(MACHINE_TYPE _machineType) internal pure returns (bool) {
    return _machineType >= MACHINE_TYPE.SPLITTER ? true : false;
  }
}

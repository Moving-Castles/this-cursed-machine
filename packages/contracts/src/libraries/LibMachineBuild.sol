// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, MachineType, BuildIndex, IncomingConnections, OutgoingConnections, TutorialLevel, GameConfig, SpawnIndex } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";

library LibMachineBuild {
  /**
   * @notice Creates a new machine entity of the specified buildable type.
   * @param _machineType The type of machine to create, specified by the MACHINE_TYPE enum.
   * @return entity The identifier for the newly created machine entity.
   */
  function build(MACHINE_TYPE _machineType) internal returns (bytes32 entity) {
    require(isBuildableMachineType(_machineType), "not buildable");
    entity = getUniqueEntity();
    create(_machineType, entity);
  }

  /**
   * @notice Creates records for a new machine entity of the specified type.
   * @param _machineType The type of machine to create, specified by the MACHINE_TYPE enum.
   * @return entity The identifier for the newly created machine entity.
   */
  function create(MACHINE_TYPE _machineType) internal returns (bytes32 entity) {
    entity = getUniqueEntity();
    create(_machineType, entity);
  }

  /**
   * @notice Creates records for a new machine of the specified type, using the provided entity.
   * @param _machineType The type of machine to create, specified by the MACHINE_TYPE enum.
   * @param _entity The identifier to be used for the machine entity creation.
   */
  function create(MACHINE_TYPE _machineType, bytes32 _entity) internal {
    EntityType.set(_entity, ENTITY_TYPE.MACHINE);
    MachineType.set(_entity, _machineType);

    // Set ports on machine
    // - - - - - - - - - - - -
    // NONE:      0 IN, 0 OUT
    // INLET:     0 IN, 1 OUT
    // OUTLET:    1 IN, 0 OUT
    // PLAYER:    1 IN, 2 OUT
    // SPLITTER:  1 IN, 2 OUT
    // MIXER:     2 IN, 1 OUT
    // WETTER:    1 IN, 1 OUT
    // DRYER:     1 IN, 1 OUT
    // BOILER:    1 IN, 1 OUT
    // COOLER:    1 IN, 1 OUT

    if (_machineType == MACHINE_TYPE.INLET) {
      IncomingConnections.set(_entity, new bytes32[](0));
      OutgoingConnections.set(_entity, new bytes32[](1));
    } else if (_machineType == MACHINE_TYPE.OUTLET) {
      IncomingConnections.set(_entity, new bytes32[](1));
      OutgoingConnections.set(_entity, new bytes32[](0));
    } else if (_machineType == MACHINE_TYPE.SPLITTER || _machineType == MACHINE_TYPE.PLAYER) {
      IncomingConnections.set(_entity, new bytes32[](1));
      OutgoingConnections.set(_entity, new bytes32[](2));
    } else if (_machineType == MACHINE_TYPE.MIXER) {
      IncomingConnections.set(_entity, new bytes32[](2));
      OutgoingConnections.set(_entity, new bytes32[](1));
    } else {
      IncomingConnections.set(_entity, new bytes32[](1));
      OutgoingConnections.set(_entity, new bytes32[](1));
    }
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

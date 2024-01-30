// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { CarriedBy, BuildIndex, MachinesInPod } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibEntity, LibPod } from "../../libraries/Libraries.sol";

contract BuildSystem is System {
  /**
   * @notice Creates a new machine entity and configures its ports
   * @param _machineType The type of machine to build, specified by the MACHINE_TYPE enum.
   * @return machineEntity The identifier for the newly created machine entity.
   */
  function build(MACHINE_TYPE _machineType) public returns (bytes32) {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    require(LibEntity.isBuildableMachineType(_machineType), "not buildable");

    // Create machine entity
    bytes32 machineEntity = LibEntity.create(_machineType);

    // Get pod entity
    bytes32 podEntity = CarriedBy.get(playerEntity);

    // Place in same pod as the player
    CarriedBy.set(machineEntity, podEntity);

    // Add it to the list of machines
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), machineEntity));

    // Get build index entity
    bytes32 buildIndexEntity = LibPod.getBuildIndexEntity(podEntity, _machineType);

    // Increment
    uint32 newBuildIndex = BuildIndex.get(buildIndexEntity) + 1;

    // Set build index on machine
    BuildIndex.set(machineEntity, newBuildIndex);

    // Set global build index
    BuildIndex.set(buildIndexEntity, newBuildIndex);

    return machineEntity;
  }
}

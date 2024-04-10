// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { CarriedBy, MachinesInPod } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibEntity, LibPod } from "../../libraries/Libraries.sol";

contract BuildSystem is System {
  /**
   * @notice Build a machine
   * @param _machineType The type of machine to build
   * @return machineEntity The identifier for the newly created machine entity.
   */
  function build(MACHINE_TYPE _machineType) public returns (bytes32 machineEntity) {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    require(LibEntity.isBuildableMachineType(_machineType), "not buildable");

    // Create machine entity
    machineEntity = LibEntity.create(_machineType);

    // Get player's pod entity
    bytes32 podEntity = CarriedBy.get(playerEntity);

    // Place in same pod as the player
    CarriedBy.set(machineEntity, podEntity);

    // Add it to the list of machines
    MachinesInPod.push(podEntity, machineEntity);

    // Set global and machine-specific build indexes
    LibPod.setMachineBuildIndex(podEntity, _machineType, machineEntity);

    return machineEntity;
  }
}

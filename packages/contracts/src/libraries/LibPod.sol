// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { EntityType, LastResolved, BuildIndex, BuildTracker } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";
import { Product } from "../structs.sol";

library LibPod {
  function create() internal returns (bytes32) {
    bytes32 podEntity = getUniqueEntity();
    EntityType.set(podEntity, ENTITY_TYPE.POD);
    LastResolved.set(podEntity, block.number);
    return podEntity;
  }

  /**
   * @dev Increments global (for all machines in the pod) build index, and sets it for the given machine
   *
   * @param _podEntity The identifier for the pod entity.
   * @param _machineType The type of machine being used.
   * @param _machineEntity The identifier for the machine entity.
   */
  function setMachineBuildIndex(bytes32 _podEntity, MACHINE_TYPE _machineType, bytes32 _machineEntity) internal {
    /**
     * Build index is used to show "Splitter #1" etc.. in the ui
     * The index is calculated per machine type and is persistent for the whole exsistence of the pod
     * We use a an array of uint32 set on the pod entity to keep track of this
     * The index of this array is the machine type, and the value the highest build index for that machine type
     */
    uint32 currentBuildIndex = BuildTracker.getItemValue(_podEntity, uint32(_machineType));

    // Set build index on machine
    BuildIndex.set(_machineEntity, currentBuildIndex + 1);

    // Increment build index for this machine type
    BuildTracker.updateValue(_podEntity, uint32(_machineType), currentBuildIndex + 1);
  }
}

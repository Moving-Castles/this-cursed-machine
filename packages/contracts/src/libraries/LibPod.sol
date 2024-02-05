// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, EntityType, LastResolved, EntityTypeTableId, CarriedBy, CarriedByTableId, MaterialType, MaterialTypeTableId, Amount, MachineType, MachineTypeTableId, BuildIndex } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";
import { Product } from "../constants.sol";
import { LibUtils } from "./LibUtils.sol";

library LibPod {
  function create() internal returns (bytes32) {
    bytes32 podEntity = LibUtils.getRandomKey();
    EntityType.set(podEntity, ENTITY_TYPE.POD);
    LastResolved.set(podEntity, block.number);
    return podEntity;
  }

  /**
   * @dev Fetches or creates a build index entity based on the specified pod entity and machine type.
   *
   * Function first queries the existing build index entities based on provided parameters. If there's an existing
   * match, it returns the corresponding entity, otherwise, it creates a new build index entity and returns it.
   *
   * @param _podEntity The identifier for the pod entity.
   * @param _machineType The type of machine being used.
   * @return buildIndexEntity The identifier for the fetched or newly created build index entity.
   */
  function getBuildIndexEntity(bytes32 _podEntity, MACHINE_TYPE _machineType) internal returns (bytes32) {
    QueryFragment[] memory fragments = new QueryFragment[](3);
    fragments[0] = QueryFragment(
      QueryType.HasValue,
      EntityTypeTableId,
      EntityType.encodeStatic(ENTITY_TYPE.BUILD_INDEX)
    );
    fragments[1] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_podEntity));
    fragments[2] = QueryFragment(QueryType.HasValue, MachineTypeTableId, MachineType.encodeStatic(_machineType));
    bytes32[][] memory keyTuples = query(fragments);
    if (keyTuples.length > 0) {
      return keyTuples[0][0];
    } else {
      // Create a new build index entity
      bytes32 buildIndexEntity = LibUtils.getRandomKey();
      EntityType.set(buildIndexEntity, ENTITY_TYPE.BUILD_INDEX);
      CarriedBy.set(buildIndexEntity, _podEntity);
      MachineType.set(buildIndexEntity, _machineType);
      BuildIndex.set(buildIndexEntity, 0);
      return buildIndexEntity;
    }
  }
}

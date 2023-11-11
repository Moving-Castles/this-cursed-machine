// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, EntityType, LastResolved, EntityTypeTableId, CreationBlock, CarriedBy, CarriedByTableId, MaterialType, MaterialTypeTableId, Amount, MachineType, MachineTypeTableId, BuildIndex, MaterialsInPod } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";
import { Product } from "../constants.sol";
import { LibUtils } from "./LibUtils.sol";
import { LibMaterial } from "./LibMaterial.sol";

library LibPod {
  /**
   * @dev Creates a new box entity with the provided properties.
   * The function generates a random key for the box entity and assigns the given attributes to it. The current block number
   * is used to record the block at which the box was created.
   * @return Returns the randomly generated key associated with the newly created box entity.
   */
  function create() internal returns (bytes32) {
    bytes32 podEntity = LibUtils.getRandomKey();
    EntityType.set(podEntity, ENTITY_TYPE.BOX);
    CreationBlock.set(podEntity, block.number);
    LastResolved.set(podEntity, block.number);
    return podEntity;
  }

  /**
   * @notice Retrieve machine entities of a specific type contained within a specified box entity.
   * @dev Constructs a query using the provided box entity and machine type and retrieves corresponding machine keys.
   * @param _podEntity The identifier of the box entity to retrieve machines for.
   * @param _machineType The type of machine entities to retrieve.
   * @return boxes A two-dimensional bytes32 array containing the keys of machines of the specified type associated with the specified box entity.
   */
  function getMachinesOfTypeByBox(
    bytes32 _podEntity,
    MACHINE_TYPE _machineType
  ) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](3);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.MACHINE));
    fragments[1] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_podEntity));
    fragments[2] = QueryFragment(QueryType.HasValue, MachineTypeTableId, MachineType.encodeStatic(_machineType));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  /**
   * @dev Retrieves materials associated with a specified box entity.
   *
   * The function queries the associated data store to find material entities
   * that are carried by the specified box entity, and returns an array of
   * tuples, where each tuple represents keys related to materials.
   *
   * @param _podEntity The identifier of the box entity to query materials for.
   *
   * @return boxes A two-dimensional array of bytes32, where each sub-array
   * represents keys (or identifiers) related to materials found.
   *
   * Note: Ensure that _podEntity is a valid identifier before invoking
   * this function. No checks for existence or validation of the box entity
   * are performed in this function. Handling of the query results
   * (keyTuples) should be done in a way that considers possible empty results.
   */
  function getMaterialsByBox(bytes32 _podEntity) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.MATERIAL));
    fragments[1] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_podEntity));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  /**
   * @notice Retrieve the identifier of a material of a specified type that is contained within a particular box entity.
   * @dev Conducts a query for materials of a specified type (_materialType) within a specified box entity (_podEntity).
   *      The query filters entities based on ENTITY_TYPE.MATERIAL, the carrier entity, and material type.
   * @param _podEntity The identifier of the box entity which supposedly contains the material.
   * @param _materialType The type of material that is being queried within the specified box entity.
   * @return material The identifier (bytes32) of the found material if it exists; otherwise, returns a zero-bytes32.
   */
  function getMaterialOfTypeByBox(
    bytes32 _podEntity,
    MATERIAL_TYPE _materialType
  ) internal view returns (bytes32 material) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_podEntity));
    fragments[1] = QueryFragment(QueryType.HasValue, MaterialTypeTableId, MaterialType.encodeStatic(_materialType));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples.length > 0 ? keyTuples[0][0] : bytes32(0);
  }

  /**
   * @dev Writes the final output(s) to various components.
   *
   * The function initializes a new material entity, sets its various attributes,
   * scales the amount by the number of blocks since the last resolution, and
   * performs various other write operations related to the output.
   *
   * @param _podEntity The entity identifier in which the material is carried.
   * @param _blocksSinceLastResolution The number of blocks passed since the last resolution.
   * @param _output A Product struct containing details about the material output (e.g., type and amount).
   *
   * Requirements:
   * - `_blocksSinceLastResolution` should be greater than or equal to 0.
   * - `_output.amount` must be scaled safely without overflow.
   *
   * Note: The actual implementation might need some checks and validations.
   */
  function writeOutput(bytes32 _podEntity, uint256 _blocksSinceLastResolution, Product memory _output) internal {
    // Scale by number of blocks since last resolution
    uint32 scaledAmount = _output.amount * uint32(_blocksSinceLastResolution);
    // Check if there alreads is a material of the same type in the box
    // @todo replace query with iterating over MaterialsInPod
    bytes32 materialEntity = getMaterialOfTypeByBox(_podEntity, _output.materialType);
    // If yes, add new amount to it
    if (materialEntity != bytes32(0)) {
      Amount.set(materialEntity, Amount.get(materialEntity) + scaledAmount);
    } else {
      // If no, create new material
      materialEntity = LibMaterial.create(_output.materialType, scaledAmount, _podEntity, bytes32(0));
      MaterialsInPod.set(_podEntity, LibUtils.addToArray(MaterialsInPod.get(_podEntity), materialEntity));
    }
  }

  /**
   * @dev Fetches or creates a build index entity based on the specified box entity and machine type.
   *
   * Function first queries the existing build index entities based on provided parameters. If there's an existing
   * match, it returns the corresponding entity, otherwise, it creates a new build index entity and returns it.
   *
   * @param _podEntity The identifier for the box entity.
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

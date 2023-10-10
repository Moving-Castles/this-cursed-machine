// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, Level, LevelTableId, EntityType, LastResolved, EntityTypeTableId, CreationBlock, CarriedBy, CarriedByTableId, MaterialType, MaterialTypeTableId, Amount, MachineType, MachineTypeTableId } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";
import { Product } from "../constants.sol";
import { LibUtils } from "./LibUtils.sol";

library LibBox {
  /**
   * @dev Creates a new box entity with the provided properties.
   *
   * The function generates a random key for the box entity and assigns the given attributes to it. The current block number
   * is used to record the block at which the box was created.
   *
   * @param _level The level assigned to the box.
   *
   * @return Returns the randomly generated key associated with the newly created box entity.
   */
  function create(uint32 _level) internal returns (bytes32) {
    bytes32 boxEntity = LibUtils.getRandomKey();
    CreationBlock.set(boxEntity, block.number);
    Level.set(boxEntity, _level);
    EntityType.set(boxEntity, ENTITY_TYPE.BOX);
    LastResolved.set(boxEntity, block.number);
    return boxEntity;
  }

  /**
   * @dev Retrieves boxes based on the specified level.
   *
   * This function forms a query using the provided level and the constant box entity type to search for matching boxes.
   *
   * @param _level The level of the boxes to retrieve.
   *
   * @return boxes An array of byte keys associated with boxes that match the specified level.
   */
  function getBoxesByLevel(uint32 _level) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.BOX));
    fragments[1] = QueryFragment(QueryType.HasValue, LevelTableId, Level.encodeStatic(_level));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  /**
   * @notice A function to retrieve cores associated with a specific box entity.
   * @dev This function forms a query with specific fragments and executes it to retrieve the cores' keys.
   * @param _boxEntity The identifier of the box entity to retrieve cores for.
   * @return boxes A two-dimensional bytes32 array containing the keys of cores associated with the specified box entity.
   */
  function getMachinesByBox(bytes32 _boxEntity) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.MACHINE));
    fragments[1] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_boxEntity));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  /**
   * @notice Retrieve machine entities of a specific type contained within a specified box entity.
   * @dev Constructs a query using the provided box entity and machine type and retrieves corresponding machine keys.
   * @param _boxEntity The identifier of the box entity to retrieve machines for.
   * @param _machineType The type of machine entities to retrieve.
   * @return boxes A two-dimensional bytes32 array containing the keys of machines of the specified type associated with the specified box entity.
   */
  function getMachinesOfTypeByBox(
    bytes32 _boxEntity,
    MACHINE_TYPE _machineType
  ) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](3);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.MACHINE));
    fragments[1] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_boxEntity));
    fragments[2] = QueryFragment(QueryType.HasValue, MachineTypeTableId, MachineType.encodeStatic(_machineType));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  /**
   * @notice Retrieve machines of a specific type associated with a specified box entity from the world state.
   * @dev Executes a query against the provided world state using the specified box entity and machine type to return keys of relevant machines.
   * @param _world The world state interface through which the query will be executed.
   * @param _boxEntity The identifier of the box entity for which machines are being queried.
   * @param _machineType The type of machine entities to retrieve.
   * @return boxes A two-dimensional bytes32 array containing the keys of machines of the specified type associated with the specified box entity in the provided world state.
   */
  function getMachinesOfTypeByBox(
    IWorld _world,
    bytes32 _boxEntity,
    MACHINE_TYPE _machineType
  ) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](3);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.MACHINE));
    fragments[1] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_boxEntity));
    fragments[2] = QueryFragment(QueryType.HasValue, MachineTypeTableId, MachineType.encodeStatic(_machineType));
    bytes32[][] memory keyTuples = query(_world, fragments);
    return keyTuples;
  }

  /**
   * @dev Retrieves materials associated with a specified box entity.
   *
   * The function queries the associated data store to find material entities
   * that are carried by the specified box entity, and returns an array of
   * tuples, where each tuple represents keys related to materials.
   *
   * @param _boxEntity The identifier of the box entity to query materials for.
   *
   * @return boxes A two-dimensional array of bytes32, where each sub-array
   * represents keys (or identifiers) related to materials found.
   *
   * Note: Ensure that _boxEntity is a valid identifier before invoking
   * this function. No checks for existence or validation of the box entity
   * are performed in this function. Handling of the query results
   * (keyTuples) should be done in a way that considers possible empty results.
   */
  function getMaterialsByBox(bytes32 _boxEntity) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.MATERIAL));
    fragments[1] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_boxEntity));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  /**
   * @dev Retrieves materials associated with a specified box entity in a specified world.
   *
   * This function queries the associated data store within the specified world to
   * find material entities that are carried by the specified box entity. It returns
   * an array of tuples, where each tuple represents keys related to materials.
   *
   * @param _world The world in which to query for materials.
   * @param _boxEntity The identifier of the box entity to query materials for.
   *
   * @return boxes A two-dimensional array of bytes32, where each sub-array
   * represents keys (or identifiers) related to materials found in the specified world.
   *
   * Note: Ensure that _world and _boxEntity are valid and exist before invoking
   * this function. No checks for existence or validation of the world and box entity
   * are performed in this function. Handling of the query results
   * (keyTuples) should be done in a way that considers possible empty results.
   */
  function getMaterialsByBox(IWorld _world, bytes32 _boxEntity) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.MATERIAL));
    fragments[1] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_boxEntity));
    bytes32[][] memory keyTuples = query(_world, fragments);
    return keyTuples;
  }

  /**
   * @notice Retrieve the identifier of a material of a specified type that is contained within a particular box entity.
   * @dev Conducts a query for materials of a specified type (_materialType) within a specified box entity (_boxEntity).
   *      The query filters entities based on ENTITY_TYPE.MATERIAL, the carrier entity, and material type.
   * @param _boxEntity The identifier of the box entity which supposedly contains the material.
   * @param _materialType The type of material that is being queried within the specified box entity.
   * @return material The identifier (bytes32) of the found material if it exists; otherwise, returns a zero-bytes32.
   */
  function getMaterialOfTypeByBox(
    bytes32 _boxEntity,
    MATERIAL_TYPE _materialType
  ) internal view returns (bytes32 material) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_boxEntity));
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
   * @param _boxEntity The entity identifier in which the material is carried.
   * @param _blocksSinceLastResolution The number of blocks passed since the last resolution.
   * @param _output A Product struct containing details about the material output (e.g., type and amount).
   *
   * Emits a `MaterialCreated` event (not implemented in the given code snippet).
   *
   * Requirements:
   * - `_blocksSinceLastResolution` should be greater than or equal to 0.
   * - `_output.amount` must be scaled safely without overflow.
   *
   * Note: The actual implementation might need some checks and validations.
   */
  function writeOutput(bytes32 _boxEntity, uint256 _blocksSinceLastResolution, Product memory _output) internal {
    // Scale by number of blocks since last resolution
    uint32 scaledAmount = _output.amount * uint32(_blocksSinceLastResolution);
    // Check if there alreads is a material of the same type in the box
    bytes32 materialEntity = getMaterialOfTypeByBox(_boxEntity, _output.materialType);

    // If yes, add new amount to it
    if (materialEntity != bytes32(0)) {
      Amount.set(materialEntity, Amount.get(materialEntity) + scaledAmount);
    } else {
      // If no, create new material
      materialEntity = LibUtils.getRandomKey();
      EntityType.set(materialEntity, ENTITY_TYPE.MATERIAL);
      CreationBlock.set(materialEntity, block.number);
      CarriedBy.set(materialEntity, _boxEntity);
      MaterialType.set(materialEntity, _output.materialType);
      Amount.set(materialEntity, scaledAmount);
    }
  }
}

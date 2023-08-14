// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, Level, LevelTableId, EntityType, EntityTypeTableId, Active, ActiveTableId, MinCores, MaxCores, Width, Height, CreationBlock } from "../codegen/Tables.sol";
import { ENTITY_TYPE } from "../codegen/Types.sol";
import { LibUtils } from "./LibUtils.sol";

library LibBox {
  /**
   * @dev Creates a new box entity with the provided properties.
   *
   * The function generates a random key for the box entity and assigns the given attributes to it. The current block number
   * is used to record the block at which the box was created.
   *
   * @param _level The level assigned to the box.
   * @param _width The width of the box.
   * @param _height The height of the box.
   * @param _minCores The minimum number of cores associated with the box.
   * @param _maxCores The maximum number of cores associated with the box.
   * @param _active A boolean indicating if the box is active or not.
   *
   * @return Returns the randomly generated key associated with the newly created box entity.
   */
  function create(
    uint32 _level,
    int32 _width,
    int32 _height,
    uint32 _minCores,
    uint32 _maxCores,
    bool _active
  ) internal returns (bytes32) {
    bytes32 boxEntity = LibUtils.getRandomKey();
    EntityType.set(boxEntity, ENTITY_TYPE.BOX);
    Level.set(boxEntity, _level);
    Width.set(boxEntity, _width);
    Height.set(boxEntity, _height);
    MinCores.set(boxEntity, _minCores);
    MaxCores.set(boxEntity, _maxCores);
    CreationBlock.set(boxEntity, block.number);
    Active.set(boxEntity, _active);
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
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encode(ENTITY_TYPE.BOX));
    fragments[1] = QueryFragment(QueryType.HasValue, LevelTableId, Level.encode(_level));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  /**
   * @dev Retrieves boxes based on the specified level that are inactive.
   *
   * This function forms a query using the provided level, the constant box entity type, and an inactive status
   * to search for matching boxes.
   *
   * @param _level The level of the boxes to retrieve.
   *
   * @return boxes An array of byte keys associated with boxes that match the specified level and are inactive.
   */
  function getInactiveBoxesByLevel(uint32 _level) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](3);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encode(ENTITY_TYPE.BOX));
    fragments[1] = QueryFragment(QueryType.HasValue, LevelTableId, Level.encode(_level));
    fragments[2] = QueryFragment(QueryType.HasValue, ActiveTableId, Active.encode(false));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }
}

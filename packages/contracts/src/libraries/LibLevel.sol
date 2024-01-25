// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { EntityType, EntityTypeTableId, MachineType, Level, LevelTableId } from "../codegen/index.sol";
import { ENTITY_TYPE } from "../codegen/common.sol";
import { LevelDefinition } from "../constants.sol";
import { LibUtils } from "./LibUtils.sol";

library LibLevel {
  /**
   * @notice Creates a new level entity with the specified level definition.
   * @param _level The definition of the level to be created
   * @return entity The identifier for the newly created level entity.
   */
  function create(LevelDefinition memory _level) internal returns (bytes32) {
    bytes32 entity = LibUtils.getRandomKey();
    EntityType.set(entity, ENTITY_TYPE.LEVEL);
    Level.set(entity, _level.level);
    return entity;
  }

  /**
   * @notice Retrieve the first matching key for a specified level.
   * @dev Queries the entity level and retrieves the first matching key using the provided _level.
   *      Utilizes a fragment query methodology, checking if the ENTITY_TYPE and Level values
   *      have the expected properties. Returns the first matching key or a zero-bytes32 if no match is found.
   * @param _level The level identifier to be queried and retrieved.
   * @return The first matching key as bytes32 if found, otherwise returns a zero-bytes32.
   */
  function getLevel(uint32 _level) internal view returns (bytes32) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.LEVEL));
    fragments[1] = QueryFragment(QueryType.HasValue, LevelTableId, Level.encodeStatic(_level));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples.length > 0 ? keyTuples[0][0] : bytes32(0);
  }
}

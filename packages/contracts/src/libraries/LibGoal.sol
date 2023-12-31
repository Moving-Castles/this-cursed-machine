// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { EntityType, EntityTypeTableId, Level, LevelTableId, MaterialType, Amount, CarriedBy, Energy } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";
import { LibPod } from "./LibPod.sol";
import { LibMaterial } from "./LibMaterial.sol";

library LibGoal {
  /**
   * @notice Create a new entity with specified attributes.
   * @dev Generates a new entity with a random key and sets its attributes: level, material type, amount.
   * @param _level The level of the entity, related to its abilities or rank.
   * @param _materialType The type of material constituting the entity.
   * @param _amount The amount or quantity of the material constituting the entity.
   * @return entity The unique identifier (bytes32) of the newly created entity.
   */
  function create(uint32 _level, MATERIAL_TYPE _materialType, uint32 _amount) internal returns (bytes32) {
    bytes32 entity = LibUtils.getRandomKey();
    EntityType.set(entity, ENTITY_TYPE.GOAL);
    Level.set(entity, _level);
    MaterialType.set(entity, _materialType);
    Amount.set(entity, _amount);
    return entity;
  }

  /**
   * @notice Determines whether all goals related to a player entity have been achieved.
   * @dev Iteratively checks through all goal-related materials and amounts to verify whether
   *      they meet or exceed specified requirements. Also retrieves goals based on the level
   *      associated with the pod entity carrying the player entity. Current implementation
   *      doesn't check for player energy sufficiency.
   * @param _playerEntity The entity identifier used to retrieve related goals and verify their achievement status.
   * @return A boolean value: true if all goals are achieved, otherwise false.
   */
  function goalsAreAchived(bytes32 _playerEntity) internal view returns (bool) {
    // Get goals for level
    bytes32[][] memory goals = getGoals(Level.get(_playerEntity));

    // Iterate over goals
    for (uint i; i < goals.length; i++) {
      MATERIAL_TYPE materialType = MaterialType.get(goals[i][0]);

      // If MATERIAL_TYPE.NONE it is a player energy check
      if (materialType == MATERIAL_TYPE.NONE) {
        if (Energy.get(_playerEntity) < Amount.get(goals[i][0])) return false;
        continue;
      }

      // Check if require materials are produced
      bytes32 material = LibPod.getMaterialOfTypeByPod(CarriedBy.get(_playerEntity), materialType);
      if (material == bytes32(0)) return false;
      if (Amount.get(material) < Amount.get(goals[i][0])) return false;
    }

    // Checks passed
    return true;
  }

  function getAmount(uint32 _level) internal view returns (uint32) {
    bytes32[][] memory goals = getGoals(_level);
    uint32 amount;
    for (uint i; i < goals.length; i++) {
      if (MaterialType.get(goals[i][0]) == MATERIAL_TYPE.NONE) continue;
      amount += Amount.get(goals[i][0]);
    }
    return amount;
  }

  /**
   * @notice Retrieves the goal entities associated with a specified level.
   * @dev Executes a query based on specified _level and ENTITY_TYPE.GOAL to find matching entities.
   *      Utilizes a fragment query methodology to extract entity keys that adhere to the specified criteria.
   * @param _level The specified level for which goal entities should be retrieved.
   * @return goals A two-dimensional bytes32 array containing the keys of goal entities that match the query.
   */
  function getGoals(uint32 _level) internal view returns (bytes32[][] memory goals) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.GOAL));
    fragments[1] = QueryFragment(QueryType.HasValue, LevelTableId, Level.encodeStatic(_level));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }
}

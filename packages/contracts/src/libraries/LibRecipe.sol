// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { EntityType, EntityTypeTableId, MachineType, MachineTypeTableId, Input, InputTableId, Output } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";

library LibRecipe {
  /**
   * @notice Create a new recipe entity with specified attributes.
   * @dev Generates a random key for a new entity and sets its type and materials.
   * @param _machineType The type of machine to be used with this recipe.
   * @param _input The type of input material for the recipe.
   * @param _output The type of output material from the recipe.
   * @return entity The unique identifier (bytes32) for the new recipe entity.
   */
  function create(MACHINE_TYPE _machineType, uint256 _input, MATERIAL_TYPE _output) internal returns (bytes32) {
    bytes32 entity = LibUtils.getRandomKey();
    EntityType.set(entity, ENTITY_TYPE.RECIPE);
    MachineType.set(entity, _machineType);
    Input.set(entity, _input);
    Output.set(entity, _output);
    return entity;
  }

  /**
   * @notice Retrieves the output material type based on specified machine and input material types.
   * @dev Utilizes query fragments to search through recipes and obtain the related output material. Assumes at least one result is found.
   * @param _machineType The type of machine being queried.
   * @param _input The type of input material being used.
   * @return The output material type corresponding to the provided machine and input types.
   */
  function getOutput(MACHINE_TYPE _machineType, uint256 _input) internal view returns (MATERIAL_TYPE) {
    console.log("...get output");
    console.log("_input");
    console.log(_input);
    QueryFragment[] memory fragments = new QueryFragment[](2);
    // fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.RECIPE));
    fragments[0] = QueryFragment(QueryType.HasValue, MachineTypeTableId, MachineType.encodeStatic(_machineType));
    fragments[1] = QueryFragment(QueryType.HasValue, InputTableId, Input.encodeStatic(_input));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples.length > 0 ? Output.get(keyTuples[0][0]) : MATERIAL_TYPE.NONE;
  }
}

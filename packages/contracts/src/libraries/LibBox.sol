// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, Level, LevelTableId, EntityType, LastResolved, EntityTypeTableId, CreationBlock, CarriedBy, CarriedByTableId, MaterialType, Amount, MachineType, MachineTypeTableId } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
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

  function getMachinesByBox(bytes32 _boxEntity) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.MACHINE));
    fragments[1] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_boxEntity));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  function getCoresByBox(bytes32 _boxEntity) internal view returns (bytes32[][] memory boxes) {
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, MachineTypeTableId, MachineType.encodeStatic(MACHINE_TYPE.CORE));
    fragments[1] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_boxEntity));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  function writeOutput(bytes32 _boxEntity, uint256 _blocksSinceLastResolution, Product memory _output) internal {
    // Write final output(s) to components
    bytes32 materialEntity = LibUtils.getRandomKey();
    EntityType.set(materialEntity, ENTITY_TYPE.MATERIAL);
    CreationBlock.set(materialEntity, block.number);
    CarriedBy.set(materialEntity, _boxEntity);
    MaterialType.set(materialEntity, _output.materialType);
    // Scale by number of blocks since last resolution
    Amount.set(materialEntity, _output.amount * uint32(_blocksSinceLastResolution));
    // ...
    // console.log("=!=!=!=!=!=!=!=!=!=");
    // console.log("=!=!=!=!= output");
    // console.log("=!=!=!=!=!=!=!=!=!=");
    // console.log("_output.materialType");
    // console.log(uint256(_output.materialType));
    // console.log(uint256(_output.amount * uint32(_blocksSinceLastResolution)));
  }
}

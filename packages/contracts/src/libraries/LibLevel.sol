// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { EntityType, MachineType, CreationBlock, Level, Energy } from "../codegen/index.sol";
import { ENTITY_TYPE } from "../codegen/common.sol";
import { LevelDefinition } from "../constants.sol";
import { LibUtils } from "./LibUtils.sol";

library LibLevel {
  /**
   * @notice Creates a new level entity with the specified level definition.
   * @param _level The definition of the level to be created, including level and initial core energy.
   * @return entity The identifier for the newly created level entity.
   */
  function create(LevelDefinition memory _level) internal returns (bytes32) {
    bytes32 entity = LibUtils.getRandomKey();
    EntityType.set(entity, ENTITY_TYPE.LEVEL);
    CreationBlock.set(entity, block.number);
    Level.set(entity, _level.level);
    Energy.set(entity, _level.initialCoreEnergy);
    return entity;
  }
}

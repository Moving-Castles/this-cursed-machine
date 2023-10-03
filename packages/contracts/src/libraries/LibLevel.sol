// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { IWorld } from "../codegen/world/IWorld.sol";
import { PortType, CarriedBy, EntityType, MachineType, CreationBlock, Level } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LevelDefinition } from "../constants.sol";
import { LibUtils } from "./LibUtils.sol";

library LibLevel {
  function create(LevelDefinition memory _level) internal returns (bytes32) {
    bytes32 entity = LibUtils.getRandomKey();
    EntityType.set(entity, ENTITY_TYPE.LEVEL);
    CreationBlock.set(entity, block.number);
    Level.set(entity, _level.level);
    return entity;
  }
}

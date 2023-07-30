// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, StartBlock, Type, Energy, Position, PositionData, BodyId, GameConfig, GameConfigData } from "../codegen/Tables.sol";
import { EntityType } from "../codegen/Types.sol";
import { LibUtils, LibMap } from "../libraries/Libraries.sol";

contract BuildSystem is System {
    function build(EntityType entityType, int32 x, int32 y) public {
        GameConfigData memory gameConfig = GameConfig.get();
        bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
        require(BodyId.get(coreEntity) == 0, "not in body");
        require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
        require(Energy.get(coreEntity) >= gameConfig.buildCost, "not enough energy");
        require(LibMap.getEntityAtPosition(PositionData({ x: x, y: y })) == 0, "occupied");
        require(entityType == EntityType.RESOURCE || entityType == EntityType.RESOURCE_TO_ENERGY, "invalid entity type");
        // Create entity at position
        bytes32 entity = LibUtils.getRandomKey();
        Type.set(entity, entityType);
        Position.set(entity, PositionData({ x: x, y: y }));
        // Reduce core energy
        Energy.set(coreEntity, Energy.get(coreEntity) - gameConfig.buildCost);
        // TODO: set cooldown
  }
}

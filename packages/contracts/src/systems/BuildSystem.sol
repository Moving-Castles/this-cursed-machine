// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, StartBlock, Type, Energy, Position, PositionData, BodyId, GameConfig, GameConfigData, SourceEntity, TargetEntity } from "../codegen/Tables.sol";
import { EntityType } from "../codegen/Types.sol";
import { LibUtils, LibMap } from "../libraries/Libraries.sol";

contract BuildSystem is System {

  // Build an organ
  function build(EntityType _entityType, PositionData memory _location) public returns (bytes32 entity) {
    GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(BodyId.get(coreEntity) == 0, "not in body");
    require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
    require(Energy.get(coreEntity) >= gameConfig.buildCost, "not enough energy");
    require(LibMap.getEntityAtPosition(_location) == 0, "occupied");
    require(_entityType == EntityType.RESOURCE || _entityType == EntityType.RESOURCE_TO_ENERGY, "invalid entity type");
    // Create entity at position
    bytes32 entity = LibUtils.getRandomKey();
    Type.set(entity, _entityType);
    Position.set(entity, _location);
    // Reduce core energy
    Energy.set(coreEntity, Energy.get(coreEntity) - gameConfig.buildCost);
    // TODO: set cooldown

    return entity;
  }

  // Build a connection between two entities
  function build(EntityType connectionType, bytes32 _sourceEntity, bytes32 _targetEntity) public returns (bytes32 connectionEntity) {
    GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(connectionType == EntityType.RESOURCE_CONNECTION || connectionType == EntityType.CONTROL_CONNECTION, "invalid type");
    // TODO: check core's sphere of influence and allow connections accordingly
    // require(_sourceEntity == coreEntity, "source not own core");

    uint32 distance = LibMap.manhattanDistance(Position.get(_sourceEntity), Position.get(_targetEntity));

    // TODO: take connection cap into account
    // TODO: take control cost into account
    uint32 cost = distance * gameConfig.resourceConnectionCost;
    require(Energy.get(coreEntity) >= cost, "not enough energy");

    Energy.set(coreEntity, Energy.get(coreEntity) - cost);

    bytes32 connectionEntity = LibUtils.getRandomKey();
    Type.set(connectionEntity, connectionType);
    SourceEntity.set(connectionEntity, _sourceEntity);
    TargetEntity.set(connectionEntity, _targetEntity);

    return connectionEntity;
  }

  function destroy(bytes32 _entity) public {

    if(Type.get(_entity) == EntityType.RESOURCE_CONNECTION || Type.get(_entity) == EntityType.CONTROL_CONNECTION) {
      SourceEntity.deleteRecord(_entity);
      TargetEntity.deleteRecord(_entity);
    } else {
      Position.deleteRecord(_entity);
    }

    Type.deleteRecord(_entity);
  }
}

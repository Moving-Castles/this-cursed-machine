// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, StartBlock, Type, Energy, Position, PositionData, BodyId, GameConfig, GameConfigData, SourceEntity, TargetEntity } from "../codegen/Tables.sol";
import { EntityType } from "../codegen/Types.sol";
import { LibUtils, LibMap, LibClaim } from "../libraries/Libraries.sol";

contract BuildSystem is System {

  function buildOrgan(EntityType _entityType, int32 _x, int32 _y) public returns (bytes32 entity) {
    GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(BodyId.get(coreEntity) == 0, "not in body");
    require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
    require(LibMap.getEntityAtPosition(PositionData({x: _x, y: _y})) == 0, "occupied");
    require(_entityType == EntityType.RESOURCE || _entityType == EntityType.RESOURCE_TO_ENERGY, "invalid entity type");

    LibClaim.settleAll();
    require(Energy.get(coreEntity) >= gameConfig.buildCost, "not enough energy");

    // Create entity at position
    bytes32 organEntity = LibUtils.getRandomKey();
    Type.set(organEntity, _entityType);
    Position.set(organEntity, PositionData({x: _x, y: _y}));
    // Reduce core energy
    Energy.set(coreEntity, Energy.get(coreEntity) - gameConfig.buildCost);
    // TODO: set cooldown

    return organEntity;
  }

  function buildConnection(EntityType connectionType, bytes32 _sourceEntity, bytes32 _targetEntity) public returns (bytes32 entity) {
    GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(connectionType == EntityType.RESOURCE_CONNECTION || connectionType == EntityType.CONTROL_CONNECTION, "invalid type");
    // TODO: check core's sphere of influence and allow connections accordingly
    // require(_sourceEntity == coreEntity, "source not own core");

    LibClaim.settleAll();

    uint32 distance = LibMap.manhattanDistance(Position.get(_sourceEntity), Position.get(_targetEntity));

    // TODO: take connection cap into account
    uint32 cost = distance * (connectionType == EntityType.RESOURCE_CONNECTION ? gameConfig.resourceConnectionCost : gameConfig.controlConnectionCost);
    require(Energy.get(coreEntity) >= cost, "not enough energy");

    Energy.set(coreEntity, Energy.get(coreEntity) - cost);

    bytes32 connectionEntity = LibUtils.getRandomKey();
    Type.set(connectionEntity, connectionType);
    SourceEntity.set(connectionEntity, _sourceEntity);
    TargetEntity.set(connectionEntity, _targetEntity);

    // Create energy claim if connection is between core and resource
    if(connectionType == EntityType.RESOURCE_CONNECTION && _sourceEntity == coreEntity && Type.get(_targetEntity) == EntityType.RESOURCE) {
      LibClaim.create(_sourceEntity, _targetEntity);
    }

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

    // TODO: settle and destroy all affected claims
  }
}

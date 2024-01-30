// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { EntityType, MaterialType, Amount, Tutorial, GoalEntity, ResourceEntity, CreationBlock } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";

library LibOrder {
  function createTutorialOrder(
    MATERIAL_TYPE _resourceMaterial,
    uint32 _resourceAmount,
    MATERIAL_TYPE _goalMaterial,
    uint32 _goalAmount
  ) internal returns (bytes32) {
    bytes32 orderEntity = LibUtils.getRandomKey();
    EntityType.set(orderEntity, ENTITY_TYPE.ORDER);

    Tutorial.set(orderEntity, true);

    bytes32 goalEntity = LibUtils.getRandomKey();
    MaterialType.set(goalEntity, _goalMaterial);
    Amount.set(goalEntity, _goalAmount);

    bytes32 resourceEntity = LibUtils.getRandomKey();
    MaterialType.set(resourceEntity, _resourceMaterial);
    Amount.set(resourceEntity, _resourceAmount);

    GoalEntity.set(orderEntity, goalEntity);
    ResourceEntity.set(orderEntity, resourceEntity);

    return orderEntity;
  }

  function createOrder(
    MATERIAL_TYPE _resourceMaterial,
    uint32 _resourceAmount,
    MATERIAL_TYPE _goalMaterial,
    uint32 _goalAmount,
    uint32 _reward,
    uint32 _duration,
    uint32 _maxPlayers
  ) internal returns (bytes32) {
    bytes32 orderEntity = LibUtils.getRandomKey();
    EntityType.set(orderEntity, ENTITY_TYPE.ORDER);

    CreationBlock.set(orderEntity, block.number);

    bytes32 goalEntity = LibUtils.getRandomKey();
    MaterialType.set(goalEntity, _goalMaterial);
    Amount.set(goalEntity, _goalAmount);

    bytes32 resourceEntity = LibUtils.getRandomKey();
    MaterialType.set(resourceEntity, _resourceMaterial);
    Amount.set(resourceEntity, _resourceAmount);

    GoalEntity.set(orderEntity, goalEntity);
    ResourceEntity.set(orderEntity, resourceEntity);

    return orderEntity;
  }
}

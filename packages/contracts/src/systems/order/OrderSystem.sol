// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, EntityType, CarriedBy, MaterialType, Amount, CurrentOrder, StorageConnection, GoalEntity, Tutorial, TutorialLevel, TutorialOrders, CompletedPlayers, ResourceEntity, DispenserEntity } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibOrder } from "../../libraries/Libraries.sol";

contract OrderSystem is System {
  function fill(bytes32 _storageEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_storageEntity) == podEntity, "not in pod");
    require(EntityType.get(_storageEntity) == ENTITY_TYPE.STORAGE, "not storage");
    require(StorageConnection.get(_storageEntity) == bytes32(0), "storage connected");
    require(CurrentOrder.get(podEntity) != bytes32(0), "no order");

    // Check if order goals are met
    require(
      MaterialType.get(_storageEntity) == MaterialType.get(GoalEntity.get(CurrentOrder.get(podEntity))) &&
        Amount.get(_storageEntity) >= Amount.get(GoalEntity.get(CurrentOrder.get(podEntity))),
      "order not met"
    );

    // Clear storage
    MaterialType.set(_storageEntity, MATERIAL_TYPE.NONE);
    Amount.set(_storageEntity, 0);

    if (Tutorial.get(playerEntity)) {
      uint32 nextTutorialLevel = TutorialLevel.get(playerEntity) + 1;

      if (nextTutorialLevel < TutorialOrders.get().length) {
        // Level up player
        TutorialLevel.set(playerEntity, nextTutorialLevel);
        CurrentOrder.set(podEntity, TutorialOrders.get()[nextTutorialLevel]);

        // Fill dispenser
        MaterialType.set(
          DispenserEntity.get(podEntity),
          MaterialType.get(ResourceEntity.get(TutorialOrders.get()[nextTutorialLevel]))
        );
        Amount.set(
          DispenserEntity.get(podEntity),
          Amount.get(ResourceEntity.get(TutorialOrders.get()[nextTutorialLevel]))
        );
      } else {
        // Tutorial done
        Tutorial.set(playerEntity, false);
        TutorialLevel.deleteRecord(playerEntity);
        CurrentOrder.set(podEntity, bytes32(0));
        // todo: give initial reward
      }

      return;
    }

    // Not in tutorial mode

    // Add player to completedPlayers list
    CompletedPlayers.set(
      CurrentOrder.get(podEntity),
      LibUtils.addToArray(CompletedPlayers.get(podEntity), playerEntity)
    );

    // Clear currentOrder
    CurrentOrder.set(podEntity, bytes32(0));

    // TODO: Reward player in tokens
  }

  function accept(bytes32 _orderEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CurrentOrder.get(podEntity) == bytes32(0), "order in progress");
    require(EntityType.get(_orderEntity) == ENTITY_TYPE.ORDER, "not order");
    require(!Tutorial.get(_orderEntity), "order is tutorial");

    // todo: check that the order is still valid
    // todo: check that the player has not already completed order

    CurrentOrder.set(podEntity, _orderEntity);

    // todo: Fill dispenser
  }

  function create(
    MATERIAL_TYPE _resourceMaterialType,
    uint32 _resourceAmount,
    MATERIAL_TYPE _goalMaterialType,
    uint32 _goalAmount,
    uint32 _reward,
    uint32 _duration,
    uint32 _maxPlayers
  ) public returns (bytes32) {
    // Todo: Restrict to admin
    // ...
    bytes32 orderEntity = LibOrder.createOrder(
      _resourceMaterialType,
      _resourceAmount,
      _goalMaterialType,
      _goalAmount,
      _reward,
      _duration,
      _maxPlayers
    );

    return orderEntity;
  }

  function cancel(bytes32 _orderEntity) public {
    // Todo: Restrict to admin
  }
}

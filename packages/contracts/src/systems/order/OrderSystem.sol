// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, CarriedBy, MaterialType, Order, Amount, CurrentOrder, StorageConnection, Tutorial, TutorialLevel, TutorialOrders, CompletedPlayers, FixedEntities, StorageInPod } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibOrder } from "../../libraries/Libraries.sol";

contract OrderSystem is System {
  function fill(bytes32 _storageEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_storageEntity) == podEntity, "not in pod");
    require(EntityType.get(_storageEntity) == ENTITY_TYPE.STORAGE, "not storage");
    require(StorageConnection.get(_storageEntity) == bytes32(0), "storage connected");

    bytes32 currentOrder = CurrentOrder.get(podEntity);
    require(currentOrder != bytes32(0), "no order");

    // Check if order goals are met
    require(
      MaterialType.get(_storageEntity) == Order.get(currentOrder).goalMaterialType &&
        Amount.get(_storageEntity) >= Order.get(currentOrder).goalAmount,
      "order not met"
    );

    // Clear storage
    MaterialType.set(_storageEntity, MATERIAL_TYPE.NONE);
    Amount.set(_storageEntity, 0);

    // Handle tutorial levels
    if (Tutorial.get(playerEntity)) {
      uint32 nextTutorialLevel = TutorialLevel.get(playerEntity) + 1;

      if (nextTutorialLevel < TutorialOrders.get().length) {
        // Level up player
        TutorialLevel.set(playerEntity, nextTutorialLevel);
        CurrentOrder.set(podEntity, TutorialOrders.get()[nextTutorialLevel]);

        // Fill storage with tutorial order
        // todo: find first empty storage
        MaterialType.set(StorageInPod.get(podEntity)[0], Order.get(CurrentOrder.get(podEntity)).resourceMaterialType);
        Amount.set(StorageInPod.get(podEntity)[0], Order.get(CurrentOrder.get(podEntity)).resourceAmount);
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
    CompletedPlayers.set(currentOrder, LibUtils.addToArray(CompletedPlayers.get(currentOrder), playerEntity));

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
      false, // Not tutorial
      _reward,
      _duration,
      _maxPlayers
    );

    return orderEntity;
  }

  function cancel(bytes32 _orderEntity) public {
    // Todo: Restrict to admin
    Order.deleteRecord(_orderEntity);
    CompletedPlayers.deleteRecord(_orderEntity);
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, EntityType, CarriedBy, MaterialType, Order, OrderData, Amount, CurrentOrder, DepotConnection, Tutorial, TutorialLevel, Completed, FixedEntities, FixedEntitiesData, DepotsInPod, EarnedPoints, OutgoingConnections, IncomingConnections } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibOrder, LibToken, LibNetwork, LibReset } from "../../libraries/Libraries.sol";
import { ArrayLib } from "@latticexyz/world-modules/src/modules/utils/ArrayLib.sol";
import { TUTORIAL_LEVELS } from "../../constants.sol";

contract OrderSystem is System {
  function createOrder(
    MATERIAL_TYPE _resourceMaterialType,
    uint32 _resourceAmount,
    MATERIAL_TYPE _goalMaterialType,
    uint32 _goalAmount,
    uint32 _reward,
    uint32 _duration,
    uint32 _maxPlayers
  ) public returns (bytes32) {
    //  Restrict to admin
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");

    bytes32 orderEntity = LibOrder.create(
      _resourceMaterialType,
      _resourceAmount,
      _goalMaterialType,
      _goalAmount,
      false, // Not tutorial
      0, // Not tutorial
      _reward,
      _duration,
      _maxPlayers
    );

    return orderEntity;
  }

  function cancel(bytes32 _orderEntity) public {
    //  Restrict to admin
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");

    Order.deleteRecord(_orderEntity);
    Completed.deleteRecord(_orderEntity);
  }

  function accept(bytes32 _orderEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(EntityType.get(_orderEntity) == ENTITY_TYPE.ORDER, "not order");

    if (Tutorial.get(playerEntity)) {
      require(Tutorial.get(_orderEntity), "not tutorial order");
      uint32 playerTutorialLevel = TutorialLevel.get(playerEntity);
      require(playerTutorialLevel == TutorialLevel.get(_orderEntity), "wrong tutorial level");

      /*
       * For didactic purposes, we wire up the pods for the tutorial levels
       */
      if (playerTutorialLevel == 0 || playerTutorialLevel == 1) {
        FixedEntitiesData memory fixedEntities = FixedEntities.get(podEntity);
        bytes32[] memory depotsInPod = DepotsInPod.get(podEntity);
        // Attach depot 1 to inlet 1
        DepotConnection.set(fixedEntities.inlets[0], depotsInPod[0]);
        DepotConnection.set(depotsInPod[0], fixedEntities.inlets[0]);
        // Attach depot 2 to outlet
        DepotConnection.set(fixedEntities.outlet, depotsInPod[1]);
        DepotConnection.set(depotsInPod[1], fixedEntities.outlet);
        // Connect Inlet 1 to Player
        OutgoingConnections.update(fixedEntities.inlets[0], 0, playerEntity);
        IncomingConnections.update(playerEntity, 0, fixedEntities.inlets[0]);
        // Disconnect Player
        OutgoingConnections.update(playerEntity, 0, bytes32(0));
        OutgoingConnections.update(playerEntity, 1, bytes32(0));
        // Disconnect outlet
        IncomingConnections.update(fixedEntities.outlet, 0, bytes32(0));
        // Resolve
        // LibNetwork.resolve(podEntity);
      } else if (playerTutorialLevel == 2) {
        // Reset pod
        LibReset.reset(podEntity);
      }
    }

    OrderData memory currentOrder = Order.get(_orderEntity);

    require(currentOrder.expirationBlock == 0 || block.number < currentOrder.expirationBlock, "order expired");
    require(!ArrayLib.includes(Completed.get(_orderEntity), playerEntity), "order already completed");

    CurrentOrder.set(podEntity, _orderEntity);
  }

  function unaccept() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    CurrentOrder.set(CarriedBy.get(playerEntity), bytes32(0));
  }

  function ship(bytes32 _depotEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_depotEntity) == podEntity, "not in pod");
    require(EntityType.get(_depotEntity) == ENTITY_TYPE.DEPOT, "not depot");
    require(DepotConnection.get(_depotEntity) == bytes32(0), "depot connected");

    bytes32 currentOrderId = CurrentOrder.get(podEntity);
    require(currentOrderId != bytes32(0), "no order");

    OrderData memory currentOrder = Order.get(currentOrderId);

    require(currentOrder.expirationBlock == 0 || block.number < currentOrder.expirationBlock, "order expired");

    // Check if order goals are met
    require(
      MaterialType.get(_depotEntity) == currentOrder.goalMaterialType &&
        Amount.get(_depotEntity) >= currentOrder.goalAmount,
      "order not met"
    );

    // Clear currentOrder
    CurrentOrder.set(podEntity, bytes32(0));

    // Empty depot
    MaterialType.set(_depotEntity, MATERIAL_TYPE.NONE);
    Amount.set(_depotEntity, 0);

    // Handle tutorial levels
    if (Tutorial.get(playerEntity)) {
      uint32 nextTutorialLevel = TutorialLevel.get(playerEntity) + 1;

      if (nextTutorialLevel < TUTORIAL_LEVELS) {
        // Level up player
        TutorialLevel.set(playerEntity, nextTutorialLevel);
      }

      // Reward player in tokens
      LibToken.send(_msgSender(), currentOrder.rewardAmount);
      EarnedPoints.set(playerEntity, EarnedPoints.get(playerEntity) + currentOrder.rewardAmount);

      return;
    }

    // Not in tutorial mode...

    // On order: add player to completed list
    Completed.push(currentOrderId, playerEntity);
    // On player: add order to completed list
    Completed.push(playerEntity, currentOrderId);

    // Reward player in tokens
    LibToken.send(_msgSender(), currentOrder.rewardAmount);
    EarnedPoints.set(playerEntity, EarnedPoints.get(playerEntity) + currentOrder.rewardAmount);
  }
}

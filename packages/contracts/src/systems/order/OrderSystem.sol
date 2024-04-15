// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, EntityType, CarriedBy, MaterialType, Order, OrderData, Amount, CurrentOrder, DepotConnection, Tutorial, TutorialLevel, Completed, DepotsInPod, EarnedPoints, OutgoingConnections, IncomingConnections, NonTransferableBalance } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibOrder, LibToken, LibNetwork, LibReset } from "../../libraries/Libraries.sol";
import { ArrayLib } from "@latticexyz/world-modules/src/modules/utils/ArrayLib.sol";
import { NUMBER_OF_TUTORIAL_LEVELS, DEPOT_CAPACITY } from "../../constants.sol";

contract OrderSystem is System {
  /**
   * @notice Create an order
   * @dev Free for admin, charges reward cost (_reward * _maxPlayers) for non-admin
   * @param _title Title of the order
   * @param _materialType Material type to produce
   * @param _amount Amount to produce
   * @param _reward Reward for completing the order
   * @param _duration Duration of the order
   * @param _maxPlayers Maximum number of players that can accept the order
   * @return orderEntity Id of the offer entity
   */
  function createOrder(
    string memory _title,
    MATERIAL_TYPE _materialType,
    uint32 _amount,
    uint32 _reward,
    uint32 _duration,
    uint32 _maxPlayers
  ) public returns (bytes32 orderEntity) {
    require(_maxPlayers > 0, "max players must be greater than 0");
    // @todo: limit title length

    // If the caller is not admin, we charge for the reward cost
    if (_msgSender() != GameConfig.getAdminAddress()) {
      uint32 totalRewardCost = _reward * _maxPlayers;
      require(LibToken.getTokenBalance(_msgSender()) > totalRewardCost, "insufficient funds");
      LibToken.transferToken(_world(), totalRewardCost);
    }

    orderEntity = LibOrder.create(
      LibUtils.addressToEntityKey(_msgSender()),
      _title,
      _materialType,
      _amount,
      false, // Not tutorial
      0, // Not tutorial
      _reward,
      _duration,
      _maxPlayers
    );

    return orderEntity;
  }

  /**
   * @notice Cancel an order
   * @dev Restricted to admin
   * @param _orderEntity Id of the order entity
   */
  function cancelOrder(bytes32 _orderEntity) public {
    //  Restrict to admin
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");

    Order.deleteRecord(_orderEntity);
    Completed.deleteRecord(_orderEntity);
  }

  /**
   * @notice Accept an order
   * @dev This simply indicates that a user is committed to an order
   * @param _orderEntity Id of the order entity
   */
  function accept(bytes32 _orderEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    require(EntityType.get(_orderEntity) == ENTITY_TYPE.ORDER, "not order");

    if (Tutorial.get(playerEntity)) {
      // A player in tutorial mode cannot accept a non-tutorial order
      require(Tutorial.get(_orderEntity), "not tutorial order");

      uint32 playerTutorialLevel = TutorialLevel.get(playerEntity);
      require(playerTutorialLevel == TutorialLevel.get(_orderEntity), "wrong tutorial level");
    }

    OrderData memory currentOrder = Order.get(_orderEntity);

    require(currentOrder.expirationBlock == 0 || block.number < currentOrder.expirationBlock, "order expired");
    require(!ArrayLib.includes(Completed.get(_orderEntity), playerEntity), "order already completed");

    CurrentOrder.set(playerEntity, _orderEntity);
  }

  /**
   * @notice Unaccept the current order
   */
  function unaccept() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    CurrentOrder.set(playerEntity, bytes32(0));
  }

  /**
   * @notice Ship an order
   * @dev Compares the depot to the current order goals and complete the order if goals are met
   * @param _depotEntity Id of the depot entity
   */
  function ship(bytes32 _depotEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(EntityType.get(_depotEntity) == ENTITY_TYPE.DEPOT, "not depot");

    // You can't ship a depot in another player's pods
    require(CarriedBy.get(_depotEntity) == podEntity, "not in pod");

    // You can't ship a depot that is connected
    require(DepotConnection.get(_depotEntity) == bytes32(0), "depot connected");

    bytes32 currentOrderId = CurrentOrder.get(playerEntity);
    require(currentOrderId != bytes32(0), "no order");

    OrderData memory currentOrder = Order.get(currentOrderId);

    // maxPlayers == 0 means the order has no limit
    require(
      currentOrder.maxPlayers == 0 || Completed.length(currentOrderId) < currentOrder.maxPlayers,
      "max players reached"
    );

    // expirationBlock == 0 means the order never expires
    require(currentOrder.expirationBlock == 0 || block.number < currentOrder.expirationBlock, "order expired");

    // Check if order goals are met
    require(
      MaterialType.get(_depotEntity) == currentOrder.materialType && Amount.get(_depotEntity) >= currentOrder.amount,
      "order not met"
    );

    // Clear currentOrder
    CurrentOrder.set(playerEntity, bytes32(0));

    // Empty depot
    MaterialType.set(_depotEntity, MATERIAL_TYPE.NONE);
    Amount.set(_depotEntity, 0);

    /*//////////////////////////////////////////////////////////////
                            IN TUTORIAL
    //////////////////////////////////////////////////////////////*/

    if (Tutorial.get(playerEntity)) {
      uint32 nextTutorialLevel = TutorialLevel.get(playerEntity) + 1;

      if (nextTutorialLevel == NUMBER_OF_TUTORIAL_LEVELS) {
        // Tutorial is done
        Tutorial.set(playerEntity, false);
        TutorialLevel.deleteRecord(playerEntity);
        NonTransferableBalance.deleteRecord(playerEntity);

        // Fill the player's first depot with bugs to get them started
        bytes32[] memory depotsInPod = DepotsInPod.get(podEntity);
        MaterialType.set(depotsInPod[0], MATERIAL_TYPE.BUG);
        Amount.set(depotsInPod[0], DEPOT_CAPACITY);

        return;
      }

      // Level up player
      TutorialLevel.set(playerEntity, nextTutorialLevel);

      /*
       * Reward player in non-transferable token substitutes
       * We do this to avoid people botting the tutorial levels to get free tokens
       */
      NonTransferableBalance.set(playerEntity, NonTransferableBalance.get(playerEntity) + currentOrder.reward);

      return;
    }

    /*//////////////////////////////////////////////////////////////
                           IN MAIN GAME
    //////////////////////////////////////////////////////////////*/

    // On order: add player to completed list
    Completed.push(currentOrderId, playerEntity);
    // On player: add order to completed list
    Completed.push(playerEntity, currentOrderId);

    // Reward player in real tokens
    LibToken.mint(_msgSender(), currentOrder.reward);
    // For statistics we keep track of the total earned points
    // EarnedPoints.set(playerEntity, EarnedPoints.get(playerEntity) + currentOrder.reward);
  }
}

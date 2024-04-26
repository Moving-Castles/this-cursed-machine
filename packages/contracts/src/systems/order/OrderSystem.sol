// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, EntityType, CarriedBy, ContainedMaterial, Order, OrderData, Amount, CurrentOrder, TankConnection, Tutorial, TutorialLevel, Completed, OutgoingConnections, IncomingConnections } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibOrder, LibNetwork, PublicMaterials, MaterialId } from "../../libraries/Libraries.sol";
import { ArrayLib } from "@latticexyz/world-modules/src/modules/utils/ArrayLib.sol";
import { NUMBER_OF_TUTORIAL_LEVELS, TANK_CAPACITY, ONE_UNIT } from "../../constants.sol";

contract OrderSystem is System {
  /**
   * @notice Create an order
   * @dev Free for admin, charges reward cost (_reward * _maxPlayers) for non-admin
   * @param _materialId Material id to produce
   * @param _amount Amount to produce in whole units
   * @param _reward Reward for completing the order in whole units
   * @param _duration Duration of the order
   * @param _maxPlayers Maximum number of players that can accept the order
   * @return orderEntity Id of the offer entity
   */
  function createOrder(
    MaterialId _materialId,
    uint256 _amount,
    uint256 _reward,
    uint32 _duration,
    uint32 _maxPlayers
  ) public returns (bytes32 orderEntity) {
    require(_maxPlayers > 0, "max players must be greater than 0");

    // If the caller is not admin, we charge for the reward cost
    if (_msgSender() != GameConfig.getAdminAddress()) {
      uint256 totalRewardCost = (_reward * ONE_UNIT) * _maxPlayers;
      require(PublicMaterials.BUG.getTokenBalance(_msgSender()) >= totalRewardCost, "insufficient funds");
      PublicMaterials.BUG.transferToken(_world(), totalRewardCost);
    }

    orderEntity = LibOrder.create(
      _msgSender(),
      _materialId,
      _amount * ONE_UNIT,
      false, // Not tutorial
      0, // Not tutorial
      _reward * ONE_UNIT,
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
  function acceptOrder(bytes32 _orderEntity) public {
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
    require(!ArrayLib.includes(Completed.get(playerEntity), _orderEntity), "order already completed");

    // maxPlayers == 0 means the order has no limit
    require(
      currentOrder.maxPlayers == 0 || Completed.length(_orderEntity) < currentOrder.maxPlayers,
      "max players reached"
    );

    CurrentOrder.set(playerEntity, _orderEntity);
  }

  /**
   * @notice Unaccept the current order
   */
  function unacceptOrder() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    CurrentOrder.set(playerEntity, bytes32(0));
  }
}

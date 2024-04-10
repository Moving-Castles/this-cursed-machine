// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, Order, OrderData, Tutorial, TutorialLevel } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";

library LibOrder {
  /**
   * @notice Create a new order
   * @param _creator Creator of the order
   * @param _title Title of the order
   * @param _materialType Material type to be produced
   * @param _amount Amount of material to be produced
   * @param _isTutorial Is the order a tutorial order
   * @param _tutorialLevel Tutorial level of the order
   * @param _reward Reward for completing the order
   * @param _duration Duration of the order
   * @param _maxPlayers Maximum number of players that can complete the order
   */

  function create(
    bytes32 _creator,
    string memory _title,
    MATERIAL_TYPE _materialType,
    uint32 _amount,
    bool _isTutorial,
    uint32 _tutorialLevel,
    uint32 _reward,
    uint32 _duration,
    uint32 _maxPlayers
  ) internal returns (bytes32) {
    bytes32 orderEntity = getUniqueEntity();
    EntityType.set(orderEntity, ENTITY_TYPE.ORDER);

    Order.set(
      orderEntity,
      OrderData({
        creationBlock: block.number,
        creator: _creator,
        title: _title,
        materialType: _materialType,
        amount: _amount,
        expirationBlock: _duration == 0 ? 0 : block.number + _duration, // 0 duration means no expiration
        reward: _reward,
        maxPlayers: _maxPlayers
      })
    );

    if (_isTutorial) {
      Tutorial.set(orderEntity, true);
      TutorialLevel.set(orderEntity, _tutorialLevel);
    }

    return orderEntity;
  }
}

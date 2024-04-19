// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, TankConnection, CurrentOrder, Order, OrderData, Completed, Tutorial, TutorialLevel, NonTransferableBalance, TanksInPod, ProducedMaterials } from "../../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibNetwork, PublicMaterials } from "../../libraries/Libraries.sol";
import { NUMBER_OF_TUTORIAL_LEVELS, TANK_CAPACITY, ONE_TOKEN_UNIT } from "../../constants.sol";

contract TankSystem is System {
  /**
   * @notice Plug in a tank to inlet or outlet
   * @dev Resolves network
   * @param _tankEntity Id of tank entity
   * @param _targetEntity Id of inlet or outlet entity
   */
  function plugTank(bytes32 _tankEntity, bytes32 _targetEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_tankEntity) == podEntity, "not in pod");
    require(EntityType.get(_tankEntity) == ENTITY_TYPE.TANK, "not tank");

    require(TankConnection.get(_tankEntity) == bytes32(0), "tank already connected");

    // Tanks can only be connected to inlets or outlets
    require(
      MachineType.get(_targetEntity) == MACHINE_TYPE.INLET || MachineType.get(_targetEntity) == MACHINE_TYPE.OUTLET,
      "not inlet/outlet"
    );

    require(TankConnection.get(_targetEntity) == bytes32(0), "target already connected");

    // Resolve network
    LibNetwork.resolve(podEntity);

    // Connect on both sides
    TankConnection.set(_targetEntity, _tankEntity);
    TankConnection.set(_tankEntity, _targetEntity);
  }

  /**
   * @notice Unplug a tank from inlet or outlet
   * @dev Resolves network
   * @param _tankEntity Id of tank entity
   */
  function unplugTank(bytes32 _tankEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    bytes32 _targetEntity = TankConnection.get(_tankEntity);

    // Resolve network
    LibNetwork.resolve(CarriedBy.get(playerEntity));

    // Disconnect on both sides
    TankConnection.set(_targetEntity, bytes32(0));
    TankConnection.set(_tankEntity, bytes32(0));
  }

  /**
   * @notice Empty a tank
   * @param _tankEntity Id of tank entity
   */
  function emptyTank(bytes32 _tankEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    require(CarriedBy.get(_tankEntity) == CarriedBy.get(playerEntity), "not in pod");
    require(EntityType.get(_tankEntity) == ENTITY_TYPE.TANK, "not tank");
    // We can not clear the tank if it is connected
    require(TankConnection.get(_tankEntity) == bytes32(0), "tank connected");

    // Clear content of tank
    MaterialType.set(_tankEntity, MATERIAL_TYPE.NONE);
    Amount.set(_tankEntity, 0);
  }

  /**
   * @notice Ship a tank to fulfil an order
   * @dev Compares the tank to the current order goals and complete the order if goals are met
   * @param _tankEntity Id of the tank entity
   */
  function shipTank(bytes32 _tankEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(EntityType.get(_tankEntity) == ENTITY_TYPE.TANK, "not tank");

    // You can't ship a tank in another player's pods
    require(CarriedBy.get(_tankEntity) == podEntity, "not in pod");

    // You can't ship a tank that is connected
    require(TankConnection.get(_tankEntity) == bytes32(0), "tank connected");

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
      MaterialType.get(_tankEntity) == currentOrder.materialType && Amount.get(_tankEntity) >= currentOrder.amount,
      "order not met"
    );

    // Clear currentOrder
    CurrentOrder.set(playerEntity, bytes32(0));

    // Deduct material amount from tank
    uint32 newAmount = Amount.get(_tankEntity) - currentOrder.amount;
    Amount.set(_tankEntity, newAmount);
    MaterialType.set(_tankEntity, newAmount == 0 ? MATERIAL_TYPE.NONE : MaterialType.get(_tankEntity));

    // On order: add player to completed list
    Completed.push(currentOrderId, playerEntity);
    // On player: add order to completed list
    Completed.push(playerEntity, currentOrderId);

    // Add material to list of materials produced by player if it is not already there
    if (!LibUtils.arrayIncludes(ProducedMaterials.get(playerEntity), uint8(currentOrder.materialType))) {
      ProducedMaterials.push(playerEntity, uint8(currentOrder.materialType));
    }

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

        // Fill the player's first tank with bugs to get them started
        bytes32[] memory tanksInPod = TanksInPod.get(podEntity);
        MaterialType.set(tanksInPod[0], MATERIAL_TYPE.BUG);
        Amount.set(tanksInPod[0], TANK_CAPACITY);

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

    // Reward player in real tokens
    PublicMaterials.BUG.mint(_msgSender(), currentOrder.reward * ONE_TOKEN_UNIT);
  }
}

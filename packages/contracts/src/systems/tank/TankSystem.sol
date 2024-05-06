// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, CarriedBy, ContainedMaterial, MachineType, Amount, TankConnection, CurrentOrder, Order, OrderData, CompletedOrders, CompletedPlayers, Tutorial, TutorialLevel, NonTransferableBalance, TanksInPod, ProducedMaterials, GameConfig } from "../../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibNetwork, LibMaterial, PublicMaterials } from "../../libraries/Libraries.sol";
import { NUMBER_OF_TUTORIAL_LEVELS, TANK_CAPACITY } from "../../constants.sol";

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
    ContainedMaterial.set(_tankEntity, LibMaterial.NONE);
    Amount.set(_tankEntity, 0);
  }

  /**
   * @notice Ship a tank to fulfill an order
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

    // expirationBlock == 0 means the order never expires
    require(currentOrder.expirationBlock == 0 || block.number < currentOrder.expirationBlock, "order expired");

    // Check if order goals are met
    require(
      ContainedMaterial.get(_tankEntity) == currentOrder.materialId && Amount.get(_tankEntity) >= currentOrder.amount,
      "order not met"
    );

    // Clear currentOrder
    CurrentOrder.set(playerEntity, bytes32(0));

    // Deduct material amount from tank
    uint256 newAmount = Amount.get(_tankEntity) - currentOrder.amount;
    Amount.set(_tankEntity, newAmount);
    ContainedMaterial.set(_tankEntity, newAmount == 0 ? LibMaterial.NONE : ContainedMaterial.get(_tankEntity));

    // On player: add order to completed list
    CompletedOrders.push(playerEntity, currentOrderId);
    // On order: increment completed players counter
    CompletedPlayers.set(currentOrderId, CompletedPlayers.get(currentOrderId) + 1);

    // Add material to list of materials produced by player if it is not already there
    if (!LibUtils.arrayIncludes(ProducedMaterials.get(playerEntity), currentOrder.materialId.unwrap())) {
      ProducedMaterials.push(playerEntity, currentOrder.materialId.unwrap());
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

        // Empty all tanks
        bytes32[] memory tanksInPod = TanksInPod.get(podEntity);
        for (uint32 i = 0; i < tanksInPod.length; i++) {
          ContainedMaterial.set(tanksInPod[i], LibMaterial.NONE);
          Amount.set(tanksInPod[i], 0);
        }

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
    PublicMaterials.BUGS.mint(_msgSender(), currentOrder.reward);

    // If the order was not created by admin, mint the material to the creator
    if (currentOrder.creator != GameConfig.getAdminAddress()) {
      LibMaterial.mint(currentOrder.materialId, currentOrder.creator, currentOrder.amount);
    }
  }
}

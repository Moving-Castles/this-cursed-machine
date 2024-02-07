// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, CurrentOrder, TutorialOrders, CarriedBy, DepotsInPod, Amount, MaterialType, Order } from "../../codegen/index.sol";
import { LibUtils } from "../../libraries/Libraries.sol";

contract WarpSystem is System {
  /**
   * @dev Used in tests to fast forward the tutorial level. NOTE: disabled for production.
   */
  function warp(uint32 _level) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);
    // Set level
    TutorialLevel.set(playerEntity, _level);
    // Set current order
    CurrentOrder.set(podEntity, TutorialOrders.get()[_level]);
    // Fill depot with tutorial order
    MaterialType.set(DepotsInPod.get(podEntity)[0], Order.get(CurrentOrder.get(podEntity)).resourceMaterialType);
    Amount.set(DepotsInPod.get(podEntity)[0], Order.get(CurrentOrder.get(podEntity)).resourceAmount);
  }
}

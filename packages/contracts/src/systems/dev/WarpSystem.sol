// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, CurrentOrder, TutorialOrders, CarriedBy, DepotsInPod, Amount, MaterialType, Order, Tutorial, Name } from "../../codegen/index.sol";
import { LibPlayer, LibToken } from "../../libraries/Libraries.sol";

contract WarpSystem is System {
  /**
   * @dev Used in testing to fast forward the tutorial level. NOTE: disable for production.
   */
  function warp(uint32 _level) public {
    bytes32 playerEntity = LibPlayer.getSpawnedPlayerEntity();
    bytes32 podEntity = CarriedBy.get(playerEntity);
    // Set level
    TutorialLevel.set(playerEntity, _level);
    // Set current order
    CurrentOrder.set(podEntity, TutorialOrders.get()[_level]);
    // Fill depot with tutorial order
    MaterialType.set(DepotsInPod.get(podEntity)[0], Order.get(CurrentOrder.get(podEntity)).resourceMaterialType);
    Amount.set(DepotsInPod.get(podEntity)[0], Order.get(CurrentOrder.get(podEntity)).resourceAmount);
  }

  /**
   * @dev Used in testing to skip tutorial levels. NOTE: disable for production.
   */
  function graduate() public {
    bytes32 playerEntity = LibPlayer.getSpawnedPlayerEntity();
    bytes32 podEntity = CarriedBy.get(playerEntity);

    TutorialLevel.deleteRecord(playerEntity);
    Tutorial.deleteRecord(playerEntity);

    // Set current order
    CurrentOrder.set(podEntity, bytes32(0));

    Name.set(playerEntity, "MEATBAG66");

    // Give tokens for testing
    LibToken.send(_msgSender(), 1000);
  }
}

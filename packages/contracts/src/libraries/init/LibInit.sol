// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { GameConfig, GameConfigData, TutorialOrders } from "../../codegen/index.sol";
import { LibOrder } from "../LibOrder.sol";
import { MATERIAL_TYPE } from "../../codegen/common.sol";

library LibInit {
  function init(address tokenAddress) internal {
    // Set game config
    GameConfig.set(GameConfigData({ tokenAddress: tokenAddress, globalSpawnIndex: 0 }));

    // Create tutorial orders
    bytes32[] memory tutorialOrders = new bytes32[](7);

    tutorialOrders[0] = LibOrder.createOrder(MATERIAL_TYPE.BUG, 1000, MATERIAL_TYPE.PISS, 500, true, 0, 0, 0);
    tutorialOrders[1] = LibOrder.createOrder(MATERIAL_TYPE.BUG, 2000, MATERIAL_TYPE.BLOOD, 500, true, 0, 0, 0);
    tutorialOrders[2] = LibOrder.createOrder(MATERIAL_TYPE.BUG, 3000, MATERIAL_TYPE.PISS, 1000, true, 0, 0, 0);
    tutorialOrders[3] = LibOrder.createOrder(MATERIAL_TYPE.BUG, 4000, MATERIAL_TYPE.BLOOD, 1000, true, 0, 0, 0);
    tutorialOrders[4] = LibOrder.createOrder(MATERIAL_TYPE.BUG, 5000, MATERIAL_TYPE.PISS, 1500, true, 0, 0, 0);
    tutorialOrders[5] = LibOrder.createOrder(MATERIAL_TYPE.BUG, 6000, MATERIAL_TYPE.BLOOD, 1500, true, 0, 0, 0);
    tutorialOrders[6] = LibOrder.createOrder(MATERIAL_TYPE.BUG, 7000, MATERIAL_TYPE.PISS, 2000, true, 0, 0, 0);

    TutorialOrders.set(tutorialOrders);
  }
}

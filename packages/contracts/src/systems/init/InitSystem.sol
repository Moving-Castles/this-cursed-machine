// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData, TutorialOrders } from "../../codegen/index.sol";
import { LibOrder } from "../../libraries/Libraries.sol";
import { MATERIAL_TYPE } from "../../codegen/common.sol";

contract InitSystem is System {
  /**
   * @notice Initializes the game configuration and creates initial level definitions.
   */
  function init(address tokenAddress) public {
    require(GameConfig.get().tokenAddress == address(0), "InitSystem: already initialized");

    // Set game config
    GameConfig.set(GameConfigData({ tokenAddress: tokenAddress, globalSpawnIndex: 0 }));

    // Create tutorial orders
    bytes32[2] memory tutorialOrders = [
      LibOrder.createTutorialOrder(MATERIAL_TYPE.BUG, 1000, MATERIAL_TYPE.PISS, 500),
      LibOrder.createTutorialOrder(MATERIAL_TYPE.BUG, 2000, MATERIAL_TYPE.BLOOD, 500)
    ];

    TutorialOrders.set(tutorialOrders);
  }
}

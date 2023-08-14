// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Position, CreationBlock, PositionData, GameConfig, GameConfigData } from "../codegen/Tables.sol";
import { LibUtils } from "../libraries/Libraries.sol";

contract InitSystem is System {
  function init() public {
    require(GameConfig.get().coreEnergyCap == 0, "InitSystem: already initialized");
    GameConfig.set(
      GameConfigData({
        coolDown: 1,
        coreEnergyCap: 300,
        coreInitialEnergy: 100,
        resourceConnectionCost: 10,
        controlConnectionCost: 20,
        buildCost: 20
      })
    );

    // // Place untraversables
    //  PositionData[4] memory untraversableTiles = [
    //   PositionData(0, 0),
    //   PositionData(3, 0),
    //   PositionData(3, 3),
    //   PositionData(0, 3)
    // ];

    // for (uint256 i = 0; i < untraversableTiles.length; ++i) {
    //   bytes32 untraversableEntity = LibUtils.getRandomKey();
    //   Type.set(untraversableEntity, EntityType.UNTRAVERSABLE);
    //   Position.set(untraversableEntity, untraversableTiles[i]);
    //   CreationBlock.set(untraversableEntity, block.number);
    // }
  }
}

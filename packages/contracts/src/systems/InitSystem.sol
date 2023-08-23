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
  }
}

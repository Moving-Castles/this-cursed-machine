// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData } from "../codegen/index.sol";

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

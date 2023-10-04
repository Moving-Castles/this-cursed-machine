// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData } from "../codegen/index.sol";
import { LibLevel } from "../libraries/Libraries.sol";
import { LevelDefinition } from "../constants.sol";

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

    LevelDefinition[7] memory levels = [
      LevelDefinition({ level: 1, energy: 100 }),
      LevelDefinition({ level: 2, energy: 100 }),
      LevelDefinition({ level: 3, energy: 100 }),
      LevelDefinition({ level: 4, energy: 100 }),
      LevelDefinition({ level: 5, energy: 100 }),
      LevelDefinition({ level: 6, energy: 100 }),
      LevelDefinition({ level: 7, energy: 100 })
    ];

    for (uint256 i = 0; i < levels.length; i++) {
      LibLevel.create(levels[i]);
    }
  }
}

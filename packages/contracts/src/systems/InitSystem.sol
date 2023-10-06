// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData } from "../codegen/index.sol";
import { LibLevel } from "../libraries/Libraries.sol";
import { LevelDefinition } from "../constants.sol";

contract InitSystem is System {
  /**
   * @notice Initializes the game configuration and creates initial level definitions.
   * @dev Ensure that the system is not initialized more than once by checking the 'coolDown' in GameConfig.
   */
  function init() public {
    require(GameConfig.get().coolDown == 0, "InitSystem: already initialized");

    // Set game config
    GameConfig.set(GameConfigData({ coolDown: 1, connectionCost: 10, buildCost: 20 }));

    // Create levels
    LevelDefinition[7] memory levels = [
      LevelDefinition({ level: 1, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 2, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 3, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 4, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 5, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 6, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 7, initialCoreEnergy: 100 })
    ];

    for (uint256 i = 0; i < levels.length; i++) {
      LibLevel.create(levels[i]);
    }
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData } from "../codegen/index.sol";
import { LibLevel, LibUtils, LibGoal } from "../libraries/Libraries.sol";
import { LevelDefinition } from "../constants.sol";
import { MATERIAL_TYPE } from "../codegen/common.sol";

contract InitSystem is System {
  /**
   * @notice Initializes the game configuration and creates initial level definitions.
   * @dev Ensure that the system is not initialized more than once by checking the 'coolDown' in GameConfig.
   */
  function init() public {
    require(GameConfig.get().coolDown == 0, "InitSystem: already initialized");

    // Set game config
    GameConfig.set(GameConfigData({ coolDown: 1, connectionCost: 0, buildCost: 0 }));

    // Create levels
    LevelDefinition[8] memory levels = [
      LevelDefinition({ level: 1, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 2, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 3, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 4, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 5, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 6, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 7, initialCoreEnergy: 100 }),
      LevelDefinition({ level: 8, initialCoreEnergy: 100 })
    ];

    for (uint256 i = 0; i < levels.length; i++) {
      LibLevel.create(levels[i]);
    }

    // Create goals for levels
    // ** 1 (MATERIAL_TYPE.NONE => Core energy check)
    LibGoal.create(1, MATERIAL_TYPE.NONE, 101);
    // ** 2
    LibGoal.create(2, MATERIAL_TYPE.PISS, 200);
    LibGoal.create(2, MATERIAL_TYPE.BLOOD, 200);
    // ** 3
    LibGoal.create(3, MATERIAL_TYPE.M150, 2000);
    // ** 4
    LibGoal.create(4, MATERIAL_TYPE.PRIME, 4000);
    // ** 5
    LibGoal.create(5, MATERIAL_TYPE.TOBACCO, 2000);
    LibGoal.create(5, MATERIAL_TYPE.MONSTER, 2000);
    // ** 6
    LibGoal.create(6, MATERIAL_TYPE.CLUB_MATE, 2000);
    // ** 7
    LibGoal.create(7, MATERIAL_TYPE.CIGARETTE_JUICE, 2000);
    // ** 8
    LibGoal.create(8, MATERIAL_TYPE.HAND_OF_GOD, 2000);
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData, EntityType } from "../codegen/index.sol";
import { LibLevel, LibUtils, LibGoal } from "../libraries/Libraries.sol";
import { LevelDefinition, WAREHOUSE_KEY } from "../constants.sol";
import { MATERIAL_TYPE, ENTITY_TYPE } from "../codegen/common.sol";

contract InitSystem is System {
  /**
   * @notice Initializes the game configuration and creates initial level definitions.
   * @dev Ensure that the system is not initialized more than once by checking the 'coolDown' in GameConfig.
   */
  function init() public {
    require(GameConfig.get().coolDown == 0, "InitSystem: already initialized");

    // Set game config
    GameConfig.set(GameConfigData({ coolDown: 1, connectionCost: 0, buildCost: 0 }));

    // Create warehouse
    bytes32 warehouseEntity = LibUtils.getRandomKey();
    EntityType.set(warehouseEntity, ENTITY_TYPE.WAREHOUSE);

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

    // Create goals for levels
    // ** 1 (MATERIAL_TYPE.NONE => Core energy check)
    LibGoal.create(1, MATERIAL_TYPE.NONE, 101);
    // ** 2
    LibGoal.create(2, MATERIAL_TYPE.PISS, 1000);
    LibGoal.create(2, MATERIAL_TYPE.BLOOD, 1000);
    // ** 3
    LibGoal.create(3, MATERIAL_TYPE.CAFFEINE_SLUSHY, 1000);
    LibGoal.create(3, MATERIAL_TYPE.CLUB_MATE, 1000);
    // ** 4
    LibGoal.create(4, MATERIAL_TYPE.MONSTER, 1000);
    LibGoal.create(4, MATERIAL_TYPE.PRIME, 1000);
    // ** 5
    LibGoal.create(5, MATERIAL_TYPE.PLANT, 1000);
    LibGoal.create(5, MATERIAL_TYPE.SLUDGE, 1000);
    // ** 6
    LibGoal.create(6, MATERIAL_TYPE.CIGARETTE_JUICE, 1000);
    LibGoal.create(6, MATERIAL_TYPE.M150, 1000);
    // ** 7
    LibGoal.create(7, MATERIAL_TYPE.ERASERBABY, 1000);
  }
}

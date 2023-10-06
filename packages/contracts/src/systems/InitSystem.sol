// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData } from "../codegen/index.sol";
import { LibLevel, LibRecipe } from "../libraries/Libraries.sol";
import { LevelDefinition } from "../constants.sol";
import { MACHINE_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";

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

    // Cooler recipes
    LibRecipe.create(MACHINE_TYPE.COOLER, MATERIAL_TYPE.MONSTER, MATERIAL_TYPE.BUG);
    LibRecipe.create(MACHINE_TYPE.COOLER, MATERIAL_TYPE.BLOOD_LIPIDS, MATERIAL_TYPE.BLOOD);
    LibRecipe.create(MACHINE_TYPE.COOLER, MATERIAL_TYPE.M150, MATERIAL_TYPE.PRIME);
    LibRecipe.create(MACHINE_TYPE.COOLER, MATERIAL_TYPE.PRIME, MATERIAL_TYPE.DIET_RED_BULL);
    LibRecipe.create(MACHINE_TYPE.COOLER, MATERIAL_TYPE.CAFFEINATED_HEMATURIC_LIQUID, MATERIAL_TYPE.CLUB_MATE);
    LibRecipe.create(MACHINE_TYPE.COOLER, MATERIAL_TYPE.DIET_RED_BULL, MATERIAL_TYPE.CLUB_MATE);

    // Wetter recipes
    LibRecipe.create(MACHINE_TYPE.WETTER, MATERIAL_TYPE.BUG, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.WETTER, MATERIAL_TYPE.DIRT, MATERIAL_TYPE.PLANT);
    LibRecipe.create(MACHINE_TYPE.WETTER, MATERIAL_TYPE.BLOOD_LIPIDS, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.WETTER, MATERIAL_TYPE.M150, MATERIAL_TYPE.PRIME);
    LibRecipe.create(MACHINE_TYPE.WETTER, MATERIAL_TYPE.PLANT, MATERIAL_TYPE.CLUB_MATE);
    LibRecipe.create(MACHINE_TYPE.WETTER, MATERIAL_TYPE.E_LIQUID, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.WETTER, MATERIAL_TYPE.TOBACCO, MATERIAL_TYPE.CIGARETTE_JUICE);
    LibRecipe.create(MACHINE_TYPE.WETTER, MATERIAL_TYPE.CIGARETTE_JUICE, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.WETTER, MATERIAL_TYPE.HAND_OF_GOD, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.WETTER, MATERIAL_TYPE.FIVE_HOUR_ENERGY, MATERIAL_TYPE.SLUDGE);

    // Dryer recipes
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.MONSTER, MATERIAL_TYPE.BUG);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.PISS, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.FIVE_HOUR_ENERGY, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.CAFFEINATED_HEMATURIC_LIQUID, MATERIAL_TYPE.DIRT);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.CLUB_MATE, MATERIAL_TYPE.DIRT);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.BLOOD_LIPIDS, MATERIAL_TYPE.DIRT);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.SLUDGE, MATERIAL_TYPE.DIRT);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.PLANT, MATERIAL_TYPE.TOBACCO);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.E_LIQUID, MATERIAL_TYPE.TOBACCO);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.CIGARETTE_JUICE, MATERIAL_TYPE.TOBACCO);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.DIET_RED_BULL, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.HAND_OF_GOD, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.DRYER, MATERIAL_TYPE.PRIME, MATERIAL_TYPE.SLUDGE);

    // Boiler recipes
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.BUG, MATERIAL_TYPE.MONSTER);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.PISS, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.BLOOD, MATERIAL_TYPE.BLOOD_LIPIDS);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.DIRT, MATERIAL_TYPE.BLOOD_LIPIDS);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.BLOOD_LIPIDS, MATERIAL_TYPE.DIRT);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.CAFFEINATED_HEMATURIC_LIQUID, MATERIAL_TYPE.PRIME);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.PLANT, MATERIAL_TYPE.CLUB_MATE);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.CLUB_MATE, MATERIAL_TYPE.DIET_RED_BULL);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.PRIME, MATERIAL_TYPE.M150);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.FIVE_HOUR_ENERGY, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.DIET_RED_BULL, MATERIAL_TYPE.PRIME);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.TOBACCO, MATERIAL_TYPE.CIGARETTE_JUICE);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.CIGARETTE_JUICE, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.HAND_OF_GOD, MATERIAL_TYPE.SLUDGE);
    LibRecipe.create(MACHINE_TYPE.BOILER, MATERIAL_TYPE.E_LIQUID, MATERIAL_TYPE.SLUDGE);
  }
}

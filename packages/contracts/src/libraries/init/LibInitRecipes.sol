// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Recipe } from "../../codegen/index.sol";
import { LibUtils } from "../LibUtils.sol";
import { MACHINE_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";

library LibInitRecipes {
  function init() internal {
    // Cooler recipes
    // ...

    // Wetter recipes
    // ...

    // Dryer recipes
    Recipe.set(MACHINE_TYPE.DRYER, uint256(MATERIAL_TYPE.BLOOD), MATERIAL_TYPE.BLOOD_MEAL);
    Recipe.set(MACHINE_TYPE.DRYER, uint256(MATERIAL_TYPE.PISS), MATERIAL_TYPE.AMMONIA);
    Recipe.set(MACHINE_TYPE.DRYER, uint256(MATERIAL_TYPE.CSX_INDUSTRIAL_GREASE), MATERIAL_TYPE.PURE_FAT);

    // Boiler recipes
    Recipe.set(MACHINE_TYPE.BOILER, uint256(MATERIAL_TYPE.PISS), MATERIAL_TYPE.NESTLE_PURE_LIFE_BOTTLED_WATER);
    Recipe.set(MACHINE_TYPE.BOILER, uint256(MATERIAL_TYPE.BLOOD), MATERIAL_TYPE.COAGULATED_BLOOD_CUBES);
    Recipe.set(MACHINE_TYPE.BOILER, uint256(MATERIAL_TYPE.BUG), MATERIAL_TYPE.CSX_INDUSTRIAL_GREASE);

    // Mixer recipes

    // AMMONIA + PURE_FAT => AESOP_ORGANIC_HAND_SOAP
    Recipe.set(
      MACHINE_TYPE.MIXER,
      LibUtils.getUniqueIdentifier(uint8(MATERIAL_TYPE.AMMONIA), uint8(MATERIAL_TYPE.PURE_FAT)),
      MATERIAL_TYPE.AESOP_ORGANIC_HAND_SOAP
    );
  }
}

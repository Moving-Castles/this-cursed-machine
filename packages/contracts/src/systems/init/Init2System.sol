// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { Recipe } from "../../codegen/index.sol";
import { LibUtils } from "../../libraries/Libraries.sol";
import { MACHINE_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";

contract Init2System is System {
  function init2() public {
    // Cooler recipes
    Recipe.set(MACHINE_TYPE.COOLER, uint256(MATERIAL_TYPE.CSX_INDUSTRIAL_GREASE), MATERIAL_TYPE.PURE_FAT);

    // Wetter recipes
    // ...

    // Dryer recipes
    Recipe.set(MACHINE_TYPE.DRYER, uint256(MATERIAL_TYPE.BLOOD), MATERIAL_TYPE.BLOOD_MEAL);
    Recipe.set(MACHINE_TYPE.DRYER, uint256(MATERIAL_TYPE.PISS), MATERIAL_TYPE.AMMONIA);

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

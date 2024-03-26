// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Recipe } from "../../codegen/index.sol";
import { LibUtils } from "../LibUtils.sol";
import { MACHINE_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";

library LibInitRecipes {
  function init() internal {
    /*//////////////////////////////////////////////////////////////
                                 PLAYER
    //////////////////////////////////////////////////////////////*/

    Recipe.set(
      MACHINE_TYPE.PLAYER,
      uint256(MATERIAL_TYPE.BUG),
      [uint8(MATERIAL_TYPE.PISS), uint8(MATERIAL_TYPE.BLOOD)]
    );

    Recipe.set(
      MACHINE_TYPE.PLAYER,
      uint256(MATERIAL_TYPE.LOW_GRADE_AMPHETAMINE),
      [uint8(MATERIAL_TYPE.PISS), uint8(MATERIAL_TYPE.BLOOD_CLOT)]
    );

    /*//////////////////////////////////////////////////////////////
                                 DRYER
    //////////////////////////////////////////////////////////////*/

    Recipe.set(MACHINE_TYPE.DRYER, uint256(MATERIAL_TYPE.BUG), [uint8(MATERIAL_TYPE.DUST), uint8(MATERIAL_TYPE.NONE)]);

    Recipe.set(MACHINE_TYPE.DRYER, uint256(MATERIAL_TYPE.PISS), [uint8(MATERIAL_TYPE.UREA), uint8(MATERIAL_TYPE.NONE)]);

    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.UREA),
      [uint8(MATERIAL_TYPE.FERTILIZER), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.EVIAN),
      [uint8(MATERIAL_TYPE.LOW_GRADE_AMPHETAMINE), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.BLOOD),
      [uint8(MATERIAL_TYPE.BLOOD_CLOT), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.BLOOD_CLOT),
      [uint8(MATERIAL_TYPE.BLOOD_MEAL), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.DUST),
      [uint8(MATERIAL_TYPE.ORGANIC_WASTE), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.INDUSTRIAL_LUBRICANT),
      [uint8(MATERIAL_TYPE.CONGEALED_FAT), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.CONGEALED_FAT),
      [uint8(MATERIAL_TYPE.RENDERED_FAT), uint8(MATERIAL_TYPE.NONE)]
    );

    /*//////////////////////////////////////////////////////////////
                                 BOILER
    //////////////////////////////////////////////////////////////*/

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.BUG),
      [uint8(MATERIAL_TYPE.INDUSTRIAL_LUBRICANT), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.BUG),
      [uint8(MATERIAL_TYPE.INDUSTRIAL_LUBRICANT), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.CONGEALED_FAT),
      [uint8(MATERIAL_TYPE.ANTIFREEZE), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.UREA),
      [uint8(MATERIAL_TYPE.AMMONIA), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.LOW_GRADE_AMPHETAMINE),
      [uint8(MATERIAL_TYPE.MEDICAL_WASTE), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.MEDICAL_WASTE),
      [uint8(MATERIAL_TYPE.INSULIN), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.INSULIN),
      [uint8(MATERIAL_TYPE.MEDICAL_WASTE), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.PISS),
      [uint8(MATERIAL_TYPE.EVIAN), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.EVIAN),
      [uint8(MATERIAL_TYPE.EVIAN), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.BLOOD_CLOT),
      [uint8(MATERIAL_TYPE.BLOOD), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.BLOOD_MEAL),
      [uint8(MATERIAL_TYPE.BLOOD), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.BLOOD),
      [uint8(MATERIAL_TYPE.ORGANIC_WASTE), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.ORGANIC_WASTE),
      [uint8(MATERIAL_TYPE.CONTAMINATED_WATER), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.HEMATURIC_FLUID),
      [uint8(MATERIAL_TYPE.CONTAMINATED_WATER), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.BOILER,
      uint256(MATERIAL_TYPE.INDUSTRIAL_LUBRICANT),
      [uint8(MATERIAL_TYPE.ANTIFREEZE), uint8(MATERIAL_TYPE.NONE)]
    );

    /*//////////////////////////////////////////////////////////////
                                 MIXER
    //////////////////////////////////////////////////////////////*/

    Recipe.set(
      MACHINE_TYPE.MIXER,
      LibUtils.getUniqueIdentifier(uint8(MATERIAL_TYPE.BLOOD), uint8(MATERIAL_TYPE.PISS)),
      [uint8(MATERIAL_TYPE.HEMATURIC_FLUID), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.MIXER,
      LibUtils.getUniqueIdentifier(uint8(MATERIAL_TYPE.CONGEALED_FAT), uint8(MATERIAL_TYPE.AMMONIA)),
      [uint8(MATERIAL_TYPE.AESOP_SOAP), uint8(MATERIAL_TYPE.NONE)]
    );

    Recipe.set(
      MACHINE_TYPE.MIXER,
      LibUtils.getUniqueIdentifier(uint8(MATERIAL_TYPE.CONGEALED_FAT), uint8(MATERIAL_TYPE.BLOOD_CLOT)),
      [uint8(MATERIAL_TYPE.BLOOD_SAUSAGE), uint8(MATERIAL_TYPE.NONE)]
    );
  }
}

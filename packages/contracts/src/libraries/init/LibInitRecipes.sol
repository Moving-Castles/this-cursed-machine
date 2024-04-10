// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Recipe } from "../../codegen/index.sol";
import { LibUtils } from "../LibUtils.sol";
import { MACHINE_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";

library LibInitRecipes {
  /**
   * @notice Create recipes needed for tutorial
   */
  function init() internal {
    /*//////////////////////////////////////////////////////////////
                                 PLAYER
    //////////////////////////////////////////////////////////////*/

    // BUG => PISS, BLOOD
    Recipe.set(
      MACHINE_TYPE.PLAYER,
      uint256(MATERIAL_TYPE.BUG),
      [uint8(MATERIAL_TYPE.PISS), uint8(MATERIAL_TYPE.BLOOD)]
    );

    /*//////////////////////////////////////////////////////////////
                                 MIXER
    //////////////////////////////////////////////////////////////*/

    // BLOOD + PISS => HEMATURIC_FLUID
    Recipe.set(
      MACHINE_TYPE.MIXER,
      LibUtils.getUniqueIdentifier(uint8(MATERIAL_TYPE.BLOOD), uint8(MATERIAL_TYPE.PISS)),
      [uint8(MATERIAL_TYPE.HEMATURIC_FLUID), uint8(MATERIAL_TYPE.NONE)]
    );

    /*//////////////////////////////////////////////////////////////
                                 DRYER
    //////////////////////////////////////////////////////////////*/

    // BUG => DUST
    Recipe.set(MACHINE_TYPE.DRYER, uint256(MATERIAL_TYPE.BUG), [uint8(MATERIAL_TYPE.DUST), uint8(MATERIAL_TYPE.NONE)]);

    // PISS => UREA
    Recipe.set(MACHINE_TYPE.DRYER, uint256(MATERIAL_TYPE.PISS), [uint8(MATERIAL_TYPE.UREA), uint8(MATERIAL_TYPE.NONE)]);

    // UREA => FERTILIZER
    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.UREA),
      [uint8(MATERIAL_TYPE.FERTILIZER), uint8(MATERIAL_TYPE.NONE)]
    );

    // EVIAN => LOW_GRADE_AMPHETAMINE
    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.EVIAN),
      [uint8(MATERIAL_TYPE.LOW_GRADE_AMPHETAMINE), uint8(MATERIAL_TYPE.NONE)]
    );

    // BLOOD => BLOOD_CLOT
    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.BLOOD),
      [uint8(MATERIAL_TYPE.BLOOD_CLOT), uint8(MATERIAL_TYPE.NONE)]
    );

    // BLOOD_CLOT => BLOOD_MEAL
    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.BLOOD_CLOT),
      [uint8(MATERIAL_TYPE.BLOOD_MEAL), uint8(MATERIAL_TYPE.NONE)]
    );

    // DUST => ORGANIC_WASTE
    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.DUST),
      [uint8(MATERIAL_TYPE.ORGANIC_WASTE), uint8(MATERIAL_TYPE.NONE)]
    );

    // INDUSTRIAL_LUBRICANT => CONGEALED_FAT
    Recipe.set(
      MACHINE_TYPE.DRYER,
      uint256(MATERIAL_TYPE.INDUSTRIAL_LUBRICANT),
      [uint8(MATERIAL_TYPE.CONGEALED_FAT), uint8(MATERIAL_TYPE.NONE)]
    );
  }
}

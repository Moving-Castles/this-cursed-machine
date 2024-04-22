// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { LibAddRecipe as a } from "./LibAddRecipe.sol";
import { PublicMaterials as m } from "./PublicMaterials.sol";

library LibInitRecipes {
  /**
   * @notice Create recipes needed for tutorial
   */
  function init() internal {
    /*//////////////////////////////////////////////////////////////
                                 PLAYER
    //////////////////////////////////////////////////////////////*/

    a.player(m.BUG, [m.PISS, m.BLOOD]);

    /*//////////////////////////////////////////////////////////////
                                 MIXER
    //////////////////////////////////////////////////////////////*/

    a.mixer([m.BLOOD, m.PISS], m.HEMATURIC);

    /*//////////////////////////////////////////////////////////////
                                 DRYER
    //////////////////////////////////////////////////////////////*/

    a.dryer(m.BUG, m.DUST);
    a.dryer(m.PISS, m.UREA);
    a.dryer(m.UREA, m.FERTILIZER);
    a.dryer(m.WATER, m.AMPHETAMINE);
    a.dryer(m.BLOOD, m.BLOOD_CLOT);
    a.dryer(m.BLOOD_CLOT, m.BLOOD_MEAL);
    a.dryer(m.DUST, m.ORGANIC_WASTE);
    a.dryer(m.LUBRICANT, m.FAT);
  }
}

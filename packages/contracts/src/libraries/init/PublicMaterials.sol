// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { MaterialId, LibMaterial } from "../LibMaterial.sol";

library PublicMaterials {
  MaterialId constant BUG = MaterialId.wrap("t_BUG");
  // PLAYER
  MaterialId constant PISS = MaterialId.wrap("t_PISS");
  MaterialId constant BLOOD = MaterialId.wrap("t_BLOOD");
  // MIXER
  MaterialId constant HEMATURIC_FLUID = MaterialId.wrap("t_HEMATURIC_FL");
  // DRYER
  MaterialId constant DUST = MaterialId.wrap("t_DUST");
  MaterialId constant UREA = MaterialId.wrap("t_UREA");
  MaterialId constant FERTILIZER = MaterialId.wrap("t_FERTILIZER");
  MaterialId constant LOW_GRADE_AMPHETAMINE = MaterialId.wrap("t_LOW_GRADE_AM");
  MaterialId constant BLOOD_CLOT = MaterialId.wrap("t_BLOOD_CLOT");
  MaterialId constant BLOOD_MEAL = MaterialId.wrap("t_BLOOD_MEAL");
  MaterialId constant ORGANIC_WASTE = MaterialId.wrap("t_ORGANIC_WAST");
  MaterialId constant CONGEALED_FAT = MaterialId.wrap("t_CONGEALED_FA");
  // HIDDEN
  MaterialId constant EVIAN = MaterialId.wrap("t_EVIAN");
  MaterialId constant INDUSTRIAL_LUBRICANT = MaterialId.wrap("t_INDUSTRIAL_L");

  function init() internal {
    LibMaterial.registerMaterial(BUG, "BUG", "BUG");
    LibMaterial.registerMaterial(PISS, "PISS", "PISS");
    LibMaterial.registerMaterial(BLOOD, "BLOOD", "BLOOD");

    LibMaterial.registerMaterial(HEMATURIC_FLUID, "HEMATURIC_FLUID", "HEMATURIC_FLUID");

    LibMaterial.registerMaterial(DUST, "DUST", "DUST");
    LibMaterial.registerMaterial(UREA, "UREA", "UREA");
    LibMaterial.registerMaterial(FERTILIZER, "FERTILIZER", "FERTILIZER");
    LibMaterial.registerMaterial(LOW_GRADE_AMPHETAMINE, "LOW_GRADE_AMPHETAMINE", "LOW_GRADE_AMPHETAMINE");
    LibMaterial.registerMaterial(BLOOD_CLOT, "BLOOD_CLOT", "BLOOD_CLOT");
    LibMaterial.registerMaterial(BLOOD_MEAL, "BLOOD_MEAL", "BLOOD_MEAL");
    LibMaterial.registerMaterial(ORGANIC_WASTE, "ORGANIC_WASTE", "ORGANIC_WASTE");
    LibMaterial.registerMaterial(CONGEALED_FAT, "CONGEALED_FAT", "CONGEALED_FAT");

    LibMaterial.registerMaterial(EVIAN, "EVIAN", "EVIAN");
    LibMaterial.registerMaterial(INDUSTRIAL_LUBRICANT, "INDUSTRIAL_LUBRICANT", "INDUSTRIAL_LUBRICANT");
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { MaterialId, LibMaterial } from "../LibMaterial.sol";
import { OrderDifficulty } from "../../constants.sol";

library PublicMaterials {
  MaterialId constant BUG = MaterialId.wrap("t_BUG");
  // PLAYER
  MaterialId constant PISS = MaterialId.wrap("t_PISS");
  MaterialId constant BLOOD = MaterialId.wrap("t_BLOOD");
  // MIXER
  MaterialId constant HEMATURIC = MaterialId.wrap("t_HEMATURIC");
  // DRYER
  MaterialId constant DUST = MaterialId.wrap("t_DUST");
  MaterialId constant UREA = MaterialId.wrap("t_UREA");
  MaterialId constant FERTILIZER = MaterialId.wrap("t_FERTILIZER");
  MaterialId constant AMPHETAMINE = MaterialId.wrap("t_AMPHETAMINE");
  MaterialId constant BLOOD_CLOT = MaterialId.wrap("t_BLOOD_CLOT");
  MaterialId constant BLOOD_MEAL = MaterialId.wrap("t_BLOOD_MEAL");
  MaterialId constant ORGANIC_WASTE = MaterialId.wrap("t_ORGANIC_WAST");
  MaterialId constant FAT = MaterialId.wrap("t_FAT");
  // HIDDEN
  MaterialId constant WATER = MaterialId.wrap("t_WATER");
  MaterialId constant LUBRICANT = MaterialId.wrap("t_LUBRICANT");

  function init() internal {
    LibMaterial.registerMaterial(BUG, "Bug", "BUG", OrderDifficulty.NONE());
    LibMaterial.registerMaterial(PISS, "Piss", "PISS", OrderDifficulty.NONE());
    LibMaterial.registerMaterial(BLOOD, "Blood", "BLOOD", OrderDifficulty.NONE());

    LibMaterial.registerMaterial(HEMATURIC, "Caffeinated Hematuric Fluid", "HEMATURIC", OrderDifficulty.INTERMEDIATE());

    LibMaterial.registerMaterial(DUST, "Dust", "DUST", OrderDifficulty.INTERMEDIATE());
    LibMaterial.registerMaterial(UREA, "Urea", "UREA", OrderDifficulty.EASY());
    LibMaterial.registerMaterial(FERTILIZER, "Fertilizer", "FERTILIZER", OrderDifficulty.EASY());
    LibMaterial.registerMaterial(AMPHETAMINE, "Low-grade Amphetamine", "AMPHETAMINE", OrderDifficulty.EASY());
    LibMaterial.registerMaterial(BLOOD_CLOT, "Blood Clot", "BLOOD_CLOT", OrderDifficulty.EASY());
    LibMaterial.registerMaterial(BLOOD_MEAL, "Blood Meal", "BLOOD_MEAL", OrderDifficulty.EASY());
    LibMaterial.registerMaterial(ORGANIC_WASTE, "Organic Waste", "ORGANIC_WASTE", OrderDifficulty.EASY());
    LibMaterial.registerMaterial(FAT, "Congealed Fat", "FAT", OrderDifficulty.EASY());

    LibMaterial.registerMaterial(WATER, "Evian", "WATER", OrderDifficulty.EASY());
    LibMaterial.registerMaterial(LUBRICANT, "TEXACO Industrial Lubricant", "LUBRICANT", OrderDifficulty.NONE());
  }
}

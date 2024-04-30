// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { MaterialId, LibMaterial } from "../LibMaterial.sol";
import { MATERIAL_DIFFICULTY } from "../../codegen/common.sol";

library PublicMaterials {
  MaterialId constant BUGS = MaterialId.wrap("t_BUGS");
  MaterialId constant PISS = MaterialId.wrap("t_PISS");
  MaterialId constant BLOOD = MaterialId.wrap("t_BLOOD");
  MaterialId constant HEMATURIC_FLUID = MaterialId.wrap("t_HEMA");
  MaterialId constant DUST = MaterialId.wrap("t_DUST");
  MaterialId constant UREA = MaterialId.wrap("t_UREA");
  MaterialId constant FERTILIZER = MaterialId.wrap("t_FRTL");
  MaterialId constant AMPHETAMINE = MaterialId.wrap("t_SPEED");
  MaterialId constant BLOOD_CLOTS = MaterialId.wrap("t_CLOT");
  MaterialId constant BLOOD_MEAL = MaterialId.wrap("t_BML");
  MaterialId constant ORGANIC_WASTE = MaterialId.wrap("t_ORW");
  MaterialId constant FAT = MaterialId.wrap("t_FAT");
  MaterialId constant EVIAN = MaterialId.wrap("t_EVIAN");
  MaterialId constant LUBRICANT = MaterialId.wrap("t_LUBE");

  // prettier-ignore
  function init() internal {
    LibMaterial.registerMaterial(BUGS, "BUGS", "BUGS", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(PISS, "PISS", "PISS", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(BLOOD, "BLOOD", "BLOOD", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(HEMATURIC_FLUID, "HEMATURIC_FLUID", "HEMA", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(DUST, "DUST", "DUST", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(UREA, "UREA", "UREA", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(FERTILIZER, "FERTILIZER", "FRTL", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(AMPHETAMINE, "AMPHETAMINE", "SPEED", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(BLOOD_CLOTS, "BLOOD_CLOTS", "CLOT", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(BLOOD_MEAL, "BLOOD_MEAL", "BML", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(ORGANIC_WASTE, "ORGANIC_WASTE", "ORW", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(FAT, "FAT", "FAT", MATERIAL_DIFFICULTY.NOVICE);
    LibMaterial.registerMaterial(EVIAN, "EVIAN", "EVIAN", MATERIAL_DIFFICULTY.INTERMEDIATE);
    LibMaterial.registerMaterial(LUBRICANT, "LUBRICANT", "LUBE", MATERIAL_DIFFICULTY.NOVICE);
  }
}

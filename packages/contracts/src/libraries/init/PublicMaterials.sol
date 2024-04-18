// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { MaterialId, LibMaterial } from "../LibMaterial.sol";

library PublicMaterials {
  MaterialId constant BUG = MaterialId.wrap("t_BUG");

  function init() internal {
    LibMaterial.registerMaterial(BUG, "BUG", "BUG", 1, 1);
  }
}

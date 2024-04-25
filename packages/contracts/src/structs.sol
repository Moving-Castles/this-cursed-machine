// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { MaterialId } from "./libraries/LibMaterial.sol";
/**
 * @dev inletActive is used to determine which of the two inlets contributed to the final product
 */
struct Product {
  bytes32 machineId;
  MaterialId materialId;
  uint256 amount;
  bool[2] inletActive;
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { MATERIAL_TYPE } from "./codegen/common.sol";
/**
 * @dev inletActive is used to determine which of the two inlets contributed to the final product
 */
struct Product {
  bytes32 machineId;
  MATERIAL_TYPE materialType;
  uint32 amount;
  bool[2] inletActive;
}

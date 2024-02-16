// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { MATERIAL_TYPE } from "./codegen/common.sol";

struct Product {
  bytes32 machineId;
  MATERIAL_TYPE materialType;
  uint32 amount;
  bool[2] inletActive;
}

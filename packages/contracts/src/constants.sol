// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { MATERIAL_TYPE } from "./codegen/Types.sol";

struct Product {
  bytes32 machineId;
  MATERIAL_TYPE materialType;
  uint32 amount;
  uint32 temperature;
}

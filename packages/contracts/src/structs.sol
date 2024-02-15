// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { MATERIAL_TYPE } from "./codegen/common.sol";

struct Product {
  bytes32 machineId;
  MATERIAL_TYPE materialType;
  uint32 amount;
  uint32[2] divisors; // How many units of material from each input are required to produce 1 unit of output material?
}

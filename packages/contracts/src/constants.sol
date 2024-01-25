// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { MATERIAL_TYPE } from "./codegen/common.sol";

bytes32 constant WAREHOUSE_KEY = 0xF001000000000000000000000000000000000000000000000000000000000000;

struct Product {
  bytes32 machineId;
  MATERIAL_TYPE materialType;
  uint32 amount;
  uint32 factor; // How many units of input material are required to produce 1 unit of output material?
}

struct LevelDefinition {
  uint32 level;
}

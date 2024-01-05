// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { MATERIAL_TYPE } from "./codegen/common.sol";

bytes32 constant WAREHOUSE_KEY = 0xF001000000000000000000000000000000000000000000000000000000000000;

struct Product {
  bytes32 machineId;
  MATERIAL_TYPE materialType;
  uint32 amount;
}

struct LevelDefinition {
  uint32 level;
  uint32 initialPlayerEnergy;
}

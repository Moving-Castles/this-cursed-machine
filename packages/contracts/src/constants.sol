// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { MATERIAL_TYPE } from "./codegen/common.sol";

struct Product {
  bytes32 machineId;
  MATERIAL_TYPE materialType;
  uint32 amount;
}

struct LevelDefinition {
  uint32 level;
  uint32 initialCoreEnergy;
}

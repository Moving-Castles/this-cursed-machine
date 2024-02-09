// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { MATERIAL_TYPE } from "./codegen/common.sol";

struct Product {
  bytes32 machineId;
  MATERIAL_TYPE materialType;
  uint32 amount;
  uint32 divisor; // How many units of input material are required to produce 1 unit of output material?
}

uint32 constant ONE_HOUR = 60 * 60;
uint32 constant ONE_DAY = 24 * ONE_HOUR;
uint32 constant FLOW_RATE = 1000;

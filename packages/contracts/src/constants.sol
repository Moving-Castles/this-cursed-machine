// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

uint32 constant NUMBER_OF_TUTORIAL_LEVELS = 3;

/// @dev Token has 18 decimals
uint256 constant ONE_TOKEN_UNIT = 1e18;

uint32 constant ONE_MINUTE = 60;
uint32 constant ONE_HOUR = 60 * 60;
uint32 constant ONE_DAY = 24 * ONE_HOUR;

/// @dev The base rate of material pushed trough the network per block
uint32 constant FLOW_RATE = 1000;
/// @dev Four fixed machines and ten buildable machines
uint32 constant POD_MACHINE_CAPACITY = 14;
uint32 constant NUMBER_OF_TANKS = 3;
uint32 constant TANK_CAPACITY = 50000;

library OrderDifficulty {
  // None (1:1 conversion), for trivial materials that aren't meant to be ordered
  function NONE() internal pure returns (uint32[2] memory) {
    return [uint32(1), 1];
  }

  // Easy (1:1.2 conversion)
  function EASY() internal pure returns (uint32[2] memory) {
    return [uint32(12), 10];
  }

  // Intermediate (1:1.5 conversion)
  function INTERMEDIATE() internal pure returns (uint32[2] memory) {
    return [uint32(15), 10];
  }

  // Medium (1:2 conversion)
  function MEDIUM() internal pure returns (uint32[2] memory) {
    return [uint32(20), 10];
  }

  // Hard (1:3 conversion)
  function HARD() internal pure returns (uint32[2] memory) {
    return [uint32(30), 10];
  }
}

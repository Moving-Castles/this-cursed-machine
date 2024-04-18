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
uint32 constant NUMBER_OF_DEPOTS = 3;
/// @dev Four fixed machines and ten buildable machines
uint32 constant POD_MACHINE_CAPACITY = 14;
uint32 constant DEPOT_CAPACITY = 50000;

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

uint32 constant TUTORIAL_LEVELS = 4;

uint32 constant ONE_MINUTE = 60;
uint32 constant ONE_HOUR = 60 * 60;
uint32 constant ONE_DAY = 24 * ONE_HOUR;

uint32 constant FLOW_RATE = 1000;
uint32 constant NUMBER_OF_DEPOTS = 3;
uint32 constant DEPOT_CAPACITY = 50000;

function COMPLETED_ORDERS_THRESHOLDS() pure returns (uint256[4] memory) {
  return [uint256(10), 15, 20, 25];
}

function POINTS_THRESHOLDS() pure returns (uint256[4] memory) {
  return [uint256(10_000), 15_000, 20_000, 25_000];
}

// For the purpose of image retrieval, ranked indexes start at 1 and end at this cap inclusively
uint32 constant ESCAPE_INDEX_RANKED_IMAGE_CAP = 11;

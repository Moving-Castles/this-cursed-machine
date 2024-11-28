// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { LastFulfilled } from "../codegen/index.sol";
import { ORDER_TIMELOCK } from "../constants.sol";

library LibOrderTimelock {
  function checkLock(bytes32 _playerEntity) internal view {
    uint256 lastFulfilled = LastFulfilled.get(_playerEntity);
    require(lastFulfilled == 0 || block.timestamp >= lastFulfilled + ORDER_TIMELOCK, "order fulfillment timelocked");
  }

  function updateLock(bytes32 _playerEntity) internal {
    LastFulfilled.set(_playerEntity, block.timestamp);
  }
}

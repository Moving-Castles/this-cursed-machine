// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { WorldContextConsumerLib } from "@latticexyz/world/src/WorldContext.sol";

import { IERC721Mintable } from "@latticexyz/world-modules/src/modules/erc721-puppet/IERC721Mintable.sol";

import { LibEscapedStumpTokenURI } from "./LibEscapedStumpTokenURI.sol";
import { GameConfig, EscapeIndex, EscapeIndexRanked } from "../codegen/index.sol";
import { COMPLETED_ORDERS_THRESHOLDS, POINTS_THRESHOLDS } from "../constants.sol";

library LibEscape {
  function incrementIndexesAndMint(bytes32 _playerEntity, uint256 _completedOrders, uint256 _points) internal {
    // Increment global escape index
    uint32 newEscapeIndex = GameConfig.getGlobalEscapeIndex() + 1;
    GameConfig.setGlobalEscapeIndex(newEscapeIndex);
    // Mark the player entity as escaped
    EscapeIndex.set(_playerEntity, newEscapeIndex);

    // Calculate ranks
    uint256 completedOrdersRank = _rank(COMPLETED_ORDERS_THRESHOLDS(), _completedOrders);
    uint256 pointsRank = _rank(POINTS_THRESHOLDS(), _points);

    // Increment ranked escape index (separate for each combination of ranks)
    uint32 newEscapeIndexRanked = EscapeIndexRanked.get(completedOrdersRank, pointsRank) + 1;
    EscapeIndexRanked.set(completedOrdersRank, pointsRank, newEscapeIndexRanked);

    // Derive tokenId from the global escape index, which is unique
    uint256 tokenId = newEscapeIndex;

    // Generate and set TokenURI for this token
    LibEscapedStumpTokenURI.initTokenURI(
      tokenId,
      _playerEntity,
      _completedOrders,
      _points,
      completedOrdersRank,
      pointsRank,
      newEscapeIndexRanked
    );

    // Mint the NFT
    IERC721Mintable escapedStumpToken = IERC721Mintable(GameConfig.getEscapedStumpTokenAddress());
    escapedStumpToken.safeMint(WorldContextConsumerLib._msgSender(), tokenId);
  }

  /**
   * @notice Rank is index+1 of the highest threshold less-than-or-equal the provided value.
   * 0 if value doesn't exceed any thresholds.
   * @param _thresholds Ascending thresholds.
   * @param _value Value to compare to thresholds.
   */
  function _rank(uint256[4] memory _thresholds, uint256 _value) private pure returns (uint256) {
    for (uint256 i = _thresholds.length - 1; i >= 0; i--) {
      if (_value >= _thresholds[i]) {
        return i + 1;
      }
    }
    return 0;
  }
}

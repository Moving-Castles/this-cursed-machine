// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { GameConfig, GameConfigData, Level, LevelTableId, Name, CreationBlock, ReadyBlock, EntityType, EntityTypeTableId, Active, ActiveTableId, Rotation } from "../codegen/Tables.sol";
import { ENTITY_TYPE, ROTATION } from "../codegen/Types.sol";
import { LibUtils } from "./LibUtils.sol";

library LibArray {
  /**
   * @dev Checks if a given `_id` exists within the provided `_nodes` array.
   *
   * @param _nodes The list of node IDs of type bytes32.
   * @param _id The ID to check for its existence in the `_nodes` list.
   * @return true if `_id` exists in `_nodes`, false otherwise.
   */
  function isIdPresent(bytes32[] memory _nodes, bytes32 _id) internal pure returns (bool) {
    for (uint i = 0; i < _nodes.length; i++) {
      if (_nodes[i] == _id) {
        return true;
      }
    }
    return false;
  }
}

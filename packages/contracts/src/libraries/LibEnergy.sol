// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { StartBlock, Energy, GameConfig, GameConfigData, Position, PositionTableId, PositionData, Type, TypeTableId, ResourceConnection } from "../codegen/Tables.sol";
import { EntityType, ConnectionType } from "../codegen/Types.sol";
import { LibUtils } from "./LibUtils.sol";
import { LibMap } from "./LibMap.sol";

library LibEnergy {
  /**
   * Settle energy
   *
   */
  function settleEnergy() internal {
    // Get all connections to food organ (entities with startBlock set)
    bytes32[][] memory connections = LibMap.getFoodConnections();
    // Nothing to settle
    if (connections.length == 0) return;

    for (uint i = 0; i < connections.length; i++) {
      // Current core id => connections[i][0]
      uint32 blocksSinceSettlement = uint32(block.number - StartBlock.get(connections[i][0]));
      uint32 earnedEnergy = blocksSinceSettlement / uint32(connections.length);

      // !!! Hack to deal with modifier
      // if(Type.get(ResourceConnection.get(connections[i][0])) == EntityType.MODIFIER) {
      //   earnedEnergy = earnedEnergy * 2;
      // }

      // Set energy to current value + earned energy, clamp to config cap
      Energy.set(
        connections[i][0],
        LibUtils.clamp(Energy.get(connections[i][0]) + earnedEnergy, GameConfig.get().coreEnergyCap)
      );
      // Set start block to current block
      StartBlock.set(connections[i][0], block.number);
    }
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { WorldContextConsumerLib } from "@latticexyz/world/src/WorldContext.sol";
import { TutorialLevel, EntityType, MachineType, OutgoingConnections, IncomingConnections, GameConfig, SpawnIndex } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibMachineBuild } from "./LibMachineBuild.sol";
import { LibUtils } from "./LibUtils.sol";

library LibPlayer {
  /**
   * @notice Returns the current player entity (based on World's _msgSender)
   */
  function _getPlayerEntity() private view returns (bytes32) {
    return LibUtils.addressToEntityKey(WorldContextConsumerLib._msgSender());
  }

  /**
   * @notice Returns whether the records for the player entity have been spawned
   */
  function _isPlayerSpawned(bytes32 _playerEntity) private view returns (bool) {
    return EntityType.get(_playerEntity) != ENTITY_TYPE.NONE;
  }

  /**
   * @notice Returns the current player entity (based on World's _msgSender), reverts if plater is not spawned
   */
  function getSpawnedPlayerEntity() internal view returns (bytes32 playerEntity) {
    playerEntity = LibUtils.addressToEntityKey(WorldContextConsumerLib._msgSender());
    require(_isPlayerSpawned(playerEntity), "player not spawned");
  }

  /**
   * @notice Spawns records for the current player entity (based on World's msgSender).
   * @return playerEntity The identifier for the newly created player entity.
   */
  function spawn() internal returns (bytes32 playerEntity) {
    playerEntity = _getPlayerEntity();
    require(!_isPlayerSpawned(playerEntity), "player already spawned");
    LibMachineBuild.create(MACHINE_TYPE.PLAYER, playerEntity);

    TutorialLevel.set(playerEntity, 0);

    uint32 newSpawnIndex = GameConfig.getGlobalSpawnIndex() + 1;
    GameConfig.setGlobalSpawnIndex(newSpawnIndex);
    SpawnIndex.set(playerEntity, newSpawnIndex);
  }
}

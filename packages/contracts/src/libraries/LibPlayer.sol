// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { TutorialLevel, EntityType, MachineType, OutgoingConnections, IncomingConnections, GameConfig, SpawnIndex } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";

library LibPlayer {
  function spawn(bytes32 _playerEntity) internal {
    EntityType.set(_playerEntity, ENTITY_TYPE.MACHINE);
    MachineType.set(_playerEntity, MACHINE_TYPE.PLAYER);
    TutorialLevel.set(_playerEntity, 0);

    uint32 newSpawnIndex = GameConfig.getGlobalSpawnIndex() + 1;
    GameConfig.setGlobalSpawnIndex(newSpawnIndex);
    SpawnIndex.set(_playerEntity, newSpawnIndex);

    // Player has 1 input and 2 outputs
    IncomingConnections.set(_playerEntity, new bytes32[](1));
    OutgoingConnections.set(_playerEntity, new bytes32[](2));
  }
}

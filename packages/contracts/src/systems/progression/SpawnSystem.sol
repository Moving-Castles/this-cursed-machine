// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, EntityType, MachineType, OutgoingConnections, IncomingConnections, GameConfig, SpawnIndex, Name } from "../../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../../codegen/common.sol";
import { LibUtils } from "../../libraries/Libraries.sol";

contract SpawnSystem is System {
  /**
   * @notice Spawn a player
   * @return playerEntity Id of player entity
   */
  function spawn(string memory _name) public returns (bytes32 playerEntity) {
    require(!LibUtils.stringEq(_name, ""), "name empty");

    playerEntity = LibUtils.addressToEntityKey(_msgSender());

    EntityType.set(playerEntity, ENTITY_TYPE.MACHINE);
    MachineType.set(playerEntity, MACHINE_TYPE.PLAYER);
    TutorialLevel.set(playerEntity, 0);
    Name.set(playerEntity, _name);

    uint32 newSpawnIndex = GameConfig.getGlobalSpawnIndex() + 1;
    GameConfig.setGlobalSpawnIndex(newSpawnIndex);
    SpawnIndex.set(playerEntity, newSpawnIndex);

    // Player has 1 input and 2 outputs
    IncomingConnections.set(playerEntity, new bytes32[](1));
    OutgoingConnections.set(playerEntity, new bytes32[](2));

    return playerEntity;
  }
}

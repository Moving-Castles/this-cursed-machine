// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { LibUtils, LibPlayer } from "../libraries/Libraries.sol";

contract SpawnSystem is System {
  /**
   * @notice Spawns a new player entity for the sender.
   * @return playerEntity The identifier of the newly spawned player entity.
   * @dev Future versions should verify that a player entity has not already been spawned for the sender.
   */
  function spawn() public returns (bytes32) {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    // @todo: check if already spawned

    // Create player entity
    LibPlayer.spawn(playerEntity);

    return playerEntity;
  }
}

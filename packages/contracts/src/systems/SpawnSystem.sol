// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { LibUtils, LibCore } from "../libraries/Libraries.sol";

contract SpawnSystem is System {
  /**
   * @notice Spawns a new core entity for the sender.
   * @return coreEntity The identifier of the newly spawned core entity.
   * @dev Future versions should verify that a core entity has not already been spawned for the sender.
   */
  function spawn() public returns (bytes32) {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // @todo: check if already spawned

    // Create core entity
    LibCore.spawn(coreEntity);

    return coreEntity;
  }
}

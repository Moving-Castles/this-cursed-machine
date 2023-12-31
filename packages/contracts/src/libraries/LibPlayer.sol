// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { Level, CreationBlock, EntityType, MachineType, OutgoingConnections, IncomingConnections } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";

library LibPlayer {
  /**
   * @notice Initializes a new player machine entity with predefined attributes.
   * @param _playerEntity The identifier for the player machine entity to be initialized.
   */
  function spawn(bytes32 _playerEntity) internal {
    EntityType.set(_playerEntity, ENTITY_TYPE.MACHINE);
    MachineType.set(_playerEntity, MACHINE_TYPE.PLAYER);
    CreationBlock.set(_playerEntity, block.number);
    Level.set(_playerEntity, 0);
    // Player has 1 input and 2 outputs
    IncomingConnections.set(_playerEntity, new bytes32[](1));
    OutgoingConnections.set(_playerEntity, new bytes32[](2));
  }
}

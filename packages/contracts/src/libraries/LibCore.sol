// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { Level, CreationBlock, ReadyBlock, EntityType, MachineType, OutgoingConnections, IncomingConnections } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";

library LibCore {
  /**
   * @notice Initializes a new core machine entity with predefined attributes.
   * @param _coreEntity The identifier for the core machine entity to be initialized.
   */
  function spawn(bytes32 _coreEntity) internal {
    EntityType.set(_coreEntity, ENTITY_TYPE.MACHINE);
    MachineType.set(_coreEntity, MACHINE_TYPE.CORE);
    CreationBlock.set(_coreEntity, block.number);
    Level.set(_coreEntity, 0);
    ReadyBlock.set(_coreEntity, block.number);
    // Core has 1 input and 2 outputs
    IncomingConnections.set(_coreEntity, new bytes32[](1));
    OutgoingConnections.set(_coreEntity, new bytes32[](2));
  }
}

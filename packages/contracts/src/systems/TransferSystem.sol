// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, MaterialType, Amount, MaterialsInPod, CompletionTimes, LevelStartBlock, OutletEntity, OutgoingConnections, IncomingConnections } from "../codegen/index.sol";
import { MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibGoal, LibNetwork, LibMaterial } from "../libraries/Libraries.sol";

contract TransferSystem is System {
  /**
   * @notice Transfers, levels up the core entity, and rearranges entities within a new box configuration.
   * @return podEntity The identifier of the newly created box entity.
   * @dev Ensure the proper deletion of the old box in future versions.
   */
  function transfer() public returns (bytes32) {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(coreEntity);

    // Level needs to be in range 1 to 6
    require(Level.get(coreEntity) > 0 && Level.get(coreEntity) < 7, "illegal level");

    // Resolve network
    LibNetwork.resolve(coreEntity);

    // Check goals
    require(LibGoal.goalsAreAchived(coreEntity), "goals not achieved");

    // Transfer goal materials to warehouse
    LibGoal.transferToWarehouse(coreEntity);

    // Destroy all output in pod
    bytes32[] memory materialsInPod = MaterialsInPod.get(podEntity);
    MaterialsInPod.set(podEntity, new bytes32[](0));
    for (uint256 i = 0; i < materialsInPod.length; i++) {
      LibMaterial.trash(materialsInPod[i]);
    }

    // Store completion time
    uint256[] memory currentCompletionTimes = CompletionTimes.get(coreEntity);
    uint256[] memory newCompletionTimes = new uint256[](currentCompletionTimes.length + 1);
    for (uint256 i = 0; i < currentCompletionTimes.length; i++) {
      newCompletionTimes[i] = currentCompletionTimes[i];
    }
    newCompletionTimes[newCompletionTimes.length - 1] = block.number - LevelStartBlock.get(coreEntity);
    CompletionTimes.set(coreEntity, newCompletionTimes);
    LevelStartBlock.set(coreEntity, block.number);

    // Level up core entity
    Level.set(coreEntity, Level.get(coreEntity) + 1);

    // Disconnect outlet
    // Get outlet entity
    bytes32 outletEntity = OutletEntity.get(podEntity);
    // Get machine referenced in incoming connections of the outlet
    bytes32[] memory outletIncomingConnections = IncomingConnections.get(outletEntity);
    bytes32[] memory sourceOutgoingConnections = OutgoingConnections.get(outletIncomingConnections[0]);
    for (uint256 j = 0; j < sourceOutgoingConnections.length; j++) {
      if (sourceOutgoingConnections[j] == outletEntity) {
        // Remove the connection from source machine's outgoing connections
        sourceOutgoingConnections[j] = bytes32(0);
        // Update the source machine's outgoing connections
        OutgoingConnections.set(outletIncomingConnections[0], sourceOutgoingConnections);
        break;
      }
    }
    // Clear outlet's incoming connections
    IncomingConnections.set(outletEntity, new bytes32[](1));

    return podEntity;
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, CreationBlock, MaterialType, Amount, MaterialsInPod, CompletionTimes, LevelStartBlock } from "../codegen/index.sol";
import { MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibGoal, LibNetwork, LibMaterial } from "../libraries/Libraries.sol";

contract CompleteSystem is System {
  function complete() public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    uint32 newLevel = Level.get(coreEntity) + 1;

    // New level needs to be 8
    require(newLevel == 8, "not final level");

    // Resolve network
    LibNetwork.resolve(coreEntity);

    // Check goals
    require(LibGoal.goalsAreAchived(coreEntity), "goals not achieved");

    // Transfer goal materials to warehouse
    LibGoal.transferToWarehouse(coreEntity);

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
    Level.set(coreEntity, newLevel);

    // Remove core from box
    CarriedBy.deleteRecord(coreEntity);
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, CreationBlock, MaterialType, Amount, MaterialsInPod, CompletionTimes, LevelStartBlock } from "../codegen/index.sol";
import { MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibGoal, LibNetwork } from "../libraries/Libraries.sol";
import { WAREHOUSE_KEY } from "../constants.sol";

contract CompleteSystem is System {
  function complete() public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(coreEntity);

    // Level needs to be 7
    require(Level.get(coreEntity) == 7, "not final level");

    // Resolve network
    LibNetwork.resolve(coreEntity);

    // Check goals
    require(LibGoal.goalsAreAchived(coreEntity), "goals not achieved");

    // Move all output to warehouse
    bytes32[] memory materialsInPod = MaterialsInPod.get(podEntity);
    for (uint256 i = 0; i < materialsInPod.length; i++) {
      CarriedBy.set(materialsInPod[i], WAREHOUSE_KEY);
    }
    MaterialsInPod.set(podEntity, new bytes32[](0));

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
    Level.set(coreEntity, 8);

    // Remove core from box
    CarriedBy.deleteRecord(coreEntity);
  }
}

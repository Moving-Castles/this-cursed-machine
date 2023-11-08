// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, Energy, EntityType, CreationBlock, MaterialType, Amount, MaterialsInPod, CompletionTime, PerformanceRatings } from "../codegen/index.sol";
import { MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibPod, LibEntity, LibLevel, LibGoal, LibNetwork, LibMaterial } from "../libraries/Libraries.sol";

contract TransferSystem is System {
  /**
   * @notice Transfers, levels up the core entity, and rearranges entities within a new box configuration.
   * @return podEntity The identifier of the newly created box entity.
   * @dev Ensure the proper deletion of the old box in future versions.
   */
  function transfer() public returns (bytes32) {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());

    bytes32 podEntity = CarriedBy.get(coreEntity);

    uint32 newLevel = Level.get(coreEntity) + 1;

    // New level needs to be in range 2 to 8
    require(newLevel > 1 && newLevel < 9, "illegal level");

    // Resolve network
    LibNetwork.resolve(coreEntity);

    // Check goals
    require(LibGoal.goalsAreAchived(coreEntity), "goals not achieved");

    // Transfer goal materials to warehouse
    LibGoal.transferToWarehouse(coreEntity);

    // Calculate performance score
    // 100 - ((goal material amount - produced material amount) / 20)
    // uint32 goalMaterialAmount = LibGoal.getAmount(Level.get(coreEntity));
    // uint32 producedMaterialAmount = LibMaterial.getAmount(CarriedBy.get(coreEntity));
    // uint32 modidfier = goalMaterialAmount > producedMaterialAmount
    //   ? 0
    //   : (goalMaterialAmount - producedMaterialAmount) / 20;
    // uint32 performanceRating = 100 - modidfier;
    // uint32 performanceRating = 100;
    // uint32[] memory currentPerformanceRatings = PerformanceRatings.get(coreEntity);
    // uint32[] memory newPerformanceRatings = new uint32[](currentPerformanceRatings.length + 1);
    // for (uint256 i = 0; i < currentPerformanceRatings.length; i++) {
    //   newPerformanceRatings[i] = currentPerformanceRatings[i];
    // }
    // newPerformanceRatings[newPerformanceRatings.length - 1] = performanceRating;
    // PerformanceRatings.set(coreEntity, newPerformanceRatings);

    // Destroy all output in pod
    bytes32[] memory materialsInPod = MaterialsInPod.get(podEntity);
    MaterialsInPod.set(podEntity, new bytes32[](0));
    for (uint256 i = 0; i < materialsInPod.length; i++) {
      LibMaterial.destroy(materialsInPod[i]);
    }

    // Level up core entity
    Level.set(coreEntity, newLevel);

    if (newLevel == 8) {
      // Core is at level 8, progression done

      // Set completion time
      CompletionTime.set(coreEntity, block.timestamp - CreationBlock.get(CarriedBy.get(coreEntity)));

      // Remove core from box
      CarriedBy.deleteRecord(coreEntity);

      // @todo Destroy old box

      // Return null-pod
      return bytes32(0);
    } else {
      // Core is at level 2-7

      // @todo disconnect outlet connection

      // Return box
      return podEntity;
    }
  }
}

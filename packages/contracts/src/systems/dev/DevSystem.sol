// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, CurrentOrder, CarriedBy, Amount, ContainedMaterial, Tutorial, Name } from "../../codegen/index.sol";
import { LibUtils, PublicMaterials, MaterialId, LibOrder } from "../../libraries/Libraries.sol";
import { ONE_UNIT, ONE_HOUR } from "../../constants.sol";

contract DevSystem is System {
  /**
   * @notice Fast forward out of tutorial
   * @dev ONLY USED FOR TESTING. DISABLE IN PRODUCTION.
   */
  function devGraduate() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    TutorialLevel.deleteRecord(playerEntity);
    Tutorial.deleteRecord(playerEntity);

    // Set current order
    CurrentOrder.set(playerEntity, bytes32(0));

    // Some tests depend on the player being given bugs here
    PublicMaterials.BUGS.mint(_msgSender(), 10000 * ONE_UNIT);
  }

  /**
   * @notice Fill tank with material
   * @param _tankEntity Id of tank entity
   * @param _amount Amount of material in whole units
   * @param _materialId Material id of the material
   * @dev ONLY USED FOR TESTING. DISABLE IN PRODUCTION.
   */
  function fillTank(bytes32 _tankEntity, uint256 _amount, MaterialId _materialId) public {
    ContainedMaterial.set(_tankEntity, _materialId);
    Amount.set(_tankEntity, _amount * ONE_UNIT);
  }

  /**
   * @notice Send 1000 BUG tokens from the world to the player.
   * @dev ONLY USED FOR TESTING. DISABLE IN PRODUCTION.
   */
  function reward() public {
    PublicMaterials.BUGS.mint(_msgSender(), 1000 * ONE_UNIT);
  }
}

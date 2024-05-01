// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, CurrentOrder, CarriedBy, Amount, ContainedMaterial, Tutorial, Name, GameConfig } from "../../codegen/index.sol";
import { LibUtils, PublicMaterials, MaterialId, LibOrder } from "../../libraries/Libraries.sol";
import { ONE_UNIT, ONE_HOUR } from "../../constants.sol";

contract DevSystem is System {
  /**
   * @notice Fast forward player out of tutorial, minting tokens to the player
   * @param _address Address of the player
   * @dev ONLY USED FOR TESTING.
   */
  function devGraduate(address _address) public {
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");

    bytes32 playerEntity = LibUtils.addressToEntityKey(_address);

    TutorialLevel.deleteRecord(playerEntity);
    Tutorial.deleteRecord(playerEntity);

    // Set current order
    CurrentOrder.set(playerEntity, bytes32(0));

    // Some tests depend on the player being given bugs here
    PublicMaterials.BUGS.mint(_address, 10000 * ONE_UNIT);
  }

  /**
   * @notice Fill tank with material
   * @param _tankEntity Id of tank entity
   * @param _amount Amount of material in whole units
   * @param _materialId Material id of the material
   * @dev ONLY USED FOR TESTING.
   */
  function devFillTank(bytes32 _tankEntity, uint256 _amount, MaterialId _materialId) public {
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");
    ContainedMaterial.set(_tankEntity, _materialId);
    Amount.set(_tankEntity, _amount * ONE_UNIT);
  }

  /**
   * @notice Mint 1000 BUG tokens to the address
   * @param _address Address to mint to
   * @dev ONLY USED FOR TESTING.
   */
  function devReward(address _address) public {
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");
    PublicMaterials.BUGS.mint(_address, 1000 * ONE_UNIT);
  }
}

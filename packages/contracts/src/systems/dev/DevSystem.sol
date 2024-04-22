// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, CurrentOrder, CarriedBy, Amount, ContainedMaterial, Tutorial, Name } from "../../codegen/index.sol";
import { LibUtils, PublicMaterials, MaterialId } from "../../libraries/Libraries.sol";
import { ONE_TOKEN_UNIT } from "../../constants.sol";

contract DevSystem is System {
  /**
   * @notice Fast forward out of tutorial
   * @dev ONLY USED FOR TESTING. DISABLE IN PRODUCTION.
   */
  function graduate() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    TutorialLevel.deleteRecord(playerEntity);
    Tutorial.deleteRecord(playerEntity);

    // Set current order
    CurrentOrder.set(playerEntity, bytes32(0));

    Name.set(playerEntity, "MEATBAG66");

    PublicMaterials.BUG.mint(_msgSender(), 10000 * ONE_TOKEN_UNIT);
  }

  /**
   * @notice Fill tank with material
   * @dev ONLY USED FOR TESTING. DISABLE IN PRODUCTION.
   */
  function fillTank(bytes32 _tankEntity, uint32 _amount, MaterialId _materialId) public {
    ContainedMaterial.set(_tankEntity, _materialId);
    Amount.set(_tankEntity, _amount);
  }

  /**
   * @notice Send 1000 BUG tokens from the world to the player.
   * @dev ONLY USED FOR TESTING. DISABLE IN PRODUCTION.
   */
  function reward() public {
    PublicMaterials.BUG.mint(_msgSender(), 1000 * ONE_TOKEN_UNIT);
  }

  /**
   * @notice Send 100 BUG tokens from the player to the world.
   * @dev ONLY USED FOR TESTING. DISABLE IN PRODUCTION.
   */
  function charge() public {
    require(PublicMaterials.BUG.getTokenBalance(_msgSender()) >= 100 * ONE_TOKEN_UNIT, "insufficient balance");
    PublicMaterials.BUG.transferToken(_world(), 100 * ONE_TOKEN_UNIT);
  }
}

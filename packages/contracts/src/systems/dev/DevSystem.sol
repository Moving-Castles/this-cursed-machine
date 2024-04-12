// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel, CurrentOrder, CarriedBy, Amount, MaterialType, Tutorial, Name } from "../../codegen/index.sol";
import { LibUtils, LibToken } from "../../libraries/Libraries.sol";
import { MATERIAL_TYPE } from "../../codegen/common.sol";

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

    LibToken.mint(_msgSender(), 10000);
  }

  /**
   * @notice Fill depot with material
   * @dev ONLY USED FOR TESTING. DISABLE IN PRODUCTION.
   */
  function fillDepot(bytes32 _depotEntity, uint32 _amount, MATERIAL_TYPE _materialType) public {
    MaterialType.set(_depotEntity, _materialType);
    Amount.set(_depotEntity, _amount);
  }

  /**
   * @notice Send 1000 tokens from the world to the player.
   * @dev ONLY USED FOR TESTING. DISABLE IN PRODUCTION.
   */
  function reward() public {
    LibToken.mint(_msgSender(), 1000);
  }

  /**
   * @notice Send 100 tokens from the player to the world.
   * @dev ONLY USED FOR TESTING. DISABLE IN PRODUCTION.
   */
  function charge() public {
    require(LibToken.getTokenBalance(_msgSender()) >= 100, "insufficient balance");
    LibToken.transferToken(_world(), 100);
  }
}

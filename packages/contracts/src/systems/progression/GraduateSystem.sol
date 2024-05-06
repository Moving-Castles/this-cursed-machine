// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { CarriedBy, CurrentOrder, Tutorial, TutorialLevel, TanksInPod, ContainedMaterial, Amount } from "../../codegen/index.sol";
import { LibUtils, LibMaterial, PublicMaterials } from "../../libraries/Libraries.sol";
import { TANK_CAPACITY } from "../../constants.sol";

contract GraduateSystem is System {
  /**
   * @notice Fast forward out of tutorial
   */
  function graduate() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    require(Tutorial.get(playerEntity), "not in tutorial");

    bytes32 podEntity = CarriedBy.get(playerEntity);

    TutorialLevel.deleteRecord(playerEntity);
    Tutorial.deleteRecord(playerEntity);

    // Clear current order
    CurrentOrder.set(playerEntity, bytes32(0));

    // Empty all tanks
    bytes32[] memory tanksInPod = TanksInPod.get(podEntity);
    for (uint32 i = 0; i < tanksInPod.length; i++) {
      ContainedMaterial.set(tanksInPod[i], LibMaterial.NONE);
      Amount.set(tanksInPod[i], 0);
    }
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { Tutorial, TutorialLevel, Name, CarriedBy, DepotsInPod, MaterialType, Amount, NonTransferableBalance } from "../../codegen/index.sol";
import { LibUtils } from "../../libraries/Libraries.sol";
import { DEPOT_CAPACITY } from "../../constants.sol";
import { MATERIAL_TYPE } from "../../codegen/common.sol";

contract NameSystem is System {
  /**
   * @notice Name a player
   * @dev A successful call to this function marks the end of the tutorial. Only allowed when on final level of tutorial
   * @param _name Name of the player
   */
  function name(string memory _name) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    require(!LibUtils.stringEq(_name, ""), "name empty");

    // Only allow naming on final level of tutorial
    require(TutorialLevel.get(playerEntity) == 3, "tutorial in progress");

    Name.set(playerEntity, _name);

    // Tutorial is done
    Tutorial.set(playerEntity, false);
    TutorialLevel.deleteRecord(playerEntity);
    NonTransferableBalance.deleteRecord(playerEntity);

    // Fill the player's first depot with bugs to get them started
    bytes32 podEntity = CarriedBy.get(playerEntity);
    bytes32[] memory depotsInPod = DepotsInPod.get(podEntity);
    MaterialType.set(depotsInPod[0], MATERIAL_TYPE.BUG);
    Amount.set(depotsInPod[0], DEPOT_CAPACITY);
  }
}

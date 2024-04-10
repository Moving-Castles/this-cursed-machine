// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { Tutorial, TutorialLevel, Name } from "../../codegen/index.sol";
import { LibUtils } from "../../libraries/Libraries.sol";

contract NameSystem is System {
  /**
   * @notice Name a player
   * @dev Only allowed when on final level of tutorial
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
  }
}

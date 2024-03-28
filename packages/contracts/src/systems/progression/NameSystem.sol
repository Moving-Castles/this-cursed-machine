// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { Tutorial, TutorialLevel, Name } from "../../codegen/index.sol";
import { LibUtils, LibNetwork } from "../../libraries/Libraries.sol";

contract NameSystem is System {
  function name(string memory _name) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    // Only allow naming when tutorial is completed
    require(TutorialLevel.get(playerEntity) == 3, "tutorial in progress");
    require(!LibUtils.stringEq(_name, ""), "name empty");

    Name.set(playerEntity, _name);

    // Tutorial is done
    Tutorial.set(playerEntity, false);
    TutorialLevel.deleteRecord(playerEntity);
  }
}

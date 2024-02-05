// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { Tutorial, Name } from "../../codegen/index.sol";
import { LibUtils, LibNetwork } from "../../libraries/Libraries.sol";

contract NameSystem is System {
  function name(string memory _name) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    // Only allow naming when tutorial is completed
    require(Tutorial.get(playerEntity) != false, "not completed");
    require(!LibUtils.stringEq(_name, ""), "name empty");
    Name.set(playerEntity, _name);
  }
}

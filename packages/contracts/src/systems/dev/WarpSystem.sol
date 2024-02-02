// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { TutorialLevel } from "../../codegen/index.sol";
import { LibUtils } from "../../libraries/Libraries.sol";

contract WarpSystem is System {
  function warp(uint32 _level) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    TutorialLevel.set(playerEntity, _level);
  }
}
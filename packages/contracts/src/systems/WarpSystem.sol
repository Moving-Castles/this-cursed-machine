// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { Level } from "../codegen/index.sol";
import { LibUtils } from "../libraries/Libraries.sol";

contract WarpSystem is System {
  function warp(uint32 _level) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    Level.set(coreEntity, _level);
  }
}

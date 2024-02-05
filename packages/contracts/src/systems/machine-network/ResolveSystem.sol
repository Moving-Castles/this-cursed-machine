// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { CarriedBy } from "../../codegen/index.sol";
import { LibUtils, LibNetwork } from "../../libraries/Libraries.sol";

contract ResolveSystem is System {
  function resolve() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);
    LibNetwork.resolve(podEntity);
  }
}

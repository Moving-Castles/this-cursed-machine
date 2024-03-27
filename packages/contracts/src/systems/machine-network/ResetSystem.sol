// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { CarriedBy } from "../../codegen/index.sol";
import { LibUtils, LibEntity, LibNetwork, LibReset } from "../../libraries/Libraries.sol";

contract ResetSystem is System {
  function reset() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);
    LibReset.reset(podEntity);
    LibNetwork.resolve(podEntity);
  }
}

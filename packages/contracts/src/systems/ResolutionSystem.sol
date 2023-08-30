// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { CarriedBy } from "../codegen/Tables.sol";
import { ROTATION } from "../codegen/Types.sol";
import { LibUtils, LibNetwork } from "../libraries/Libraries.sol";

contract ResolutionSystem is System {
  function resolve() public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // Resolve network
    LibNetwork.resolve(CarriedBy.get(coreEntity));
  }
}

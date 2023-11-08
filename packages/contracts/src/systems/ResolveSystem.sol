// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { LibUtils, LibNetwork } from "../libraries/Libraries.sol";

contract ResolveSystem is System {
  /**
   * @notice Triggers the resolution of the network associated with the sender's core entity.
   */
  function resolve() public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    LibNetwork.resolve(coreEntity);
  }
}

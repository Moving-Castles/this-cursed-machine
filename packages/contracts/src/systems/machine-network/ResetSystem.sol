// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { CarriedBy } from "../../codegen/index.sol";
import { LibUtils, LibNetwork, LibReset } from "../../libraries/Libraries.sol";

contract ResetSystem is System {
  /**
   * @notice Reset network in pod
   * @dev Remove all machines, connections and depot attachments. Resolves network
   */
  function reset() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);
    LibNetwork.resolve(podEntity);
    LibReset.reset(podEntity);
  }
}

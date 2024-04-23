// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { CarriedBy } from "../../codegen/index.sol";
import { LibUtils, LibNetwork, LibWipe } from "../../libraries/Libraries.sol";

contract WipeSystem is System {
  /**
   * @notice Wipe pod
   * @dev Remove all machines, connections and tank attachments. Resolves network
   */
  function wipePod() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);
    LibNetwork.resolve(podEntity);
    LibWipe.wipe(podEntity);
  }
}

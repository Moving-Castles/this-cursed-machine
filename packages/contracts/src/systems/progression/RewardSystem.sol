// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig } from "../../codegen/index.sol";
import { LibToken } from "../../libraries/Libraries.sol";

contract RewardSystem is System {
  // Just used for testing
  function reward() public {
    LibToken.send(_msgSender(), 1000);
  }

  // Just used for testing
  function charge() public {
    require(LibToken.getTokenBalance(_msgSender()) >= 100, "insufficient balance");
    LibToken.transferToken(_world(), _world(), 100);
  }
}

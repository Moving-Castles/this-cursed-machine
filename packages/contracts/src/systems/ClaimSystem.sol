// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { LibClaim } from "../libraries/Libraries.sol";

contract ClaimSystem is System {
  function settle() public {
    LibClaim.settleAll();
  }
}

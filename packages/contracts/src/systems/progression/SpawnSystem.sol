// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { LibUtils, LibPlayer } from "../../libraries/Libraries.sol";

contract SpawnSystem is System {
  function spawn() public returns (bytes32) {
    // Create player entity
    return LibPlayer.spawn();
  }
}

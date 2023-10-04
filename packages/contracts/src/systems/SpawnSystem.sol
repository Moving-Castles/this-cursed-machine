// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { CarriedBy, GameConfig, GameConfigData } from "../codegen/index.sol";
import { LibUtils, LibCore } from "../libraries/Libraries.sol";

contract SpawnSystem is System {
  function spawn() public returns (bytes32) {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // TODO: check if already spawned

    // Create core entity
    LibCore.spawn(coreEntity, 0);

    return coreEntity;
  }
}

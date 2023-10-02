// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, GameConfig, GameConfigData } from "../codegen/index.sol";
import { LibUtils, LibBox, LibNetwork } from "../libraries/Libraries.sol";

contract TransferSystem is System {
  function transfer() public returns (bytes32) {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());

    // Resolve network
    LibNetwork.resolve(CarriedBy.get(coreEntity));

    uint32 newLevel = Level.get(coreEntity) + 1;

    bytes32 boxEntity = LibBox.create(newLevel);

    // Level up core entity
    CarriedBy.set(coreEntity, boxEntity);
    Level.set(coreEntity, newLevel);

    // TODO: create ports on core entity
    // TODO: destroy old box
    // ...

    return boxEntity;
  }
}

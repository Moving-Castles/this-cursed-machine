// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, ClaimBlock, CreationBlock, Level, Active, MinCores, MaxCores, EntityType, Height, Width, Position, PositionData, CarriedBy, GameConfig, GameConfigData } from "../codegen/Tables.sol";
import { ENTITY_TYPE } from "../codegen/Types.sol";
import { LibUtils, LibMap, LibBox, LibNetwork } from "../libraries/Libraries.sol";

contract TransferSystem is System {
  function transfer() public returns (bytes32) {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());

    LibNetwork.resolve(CarriedBy.get(coreEntity));

    uint32 newLevel = Level.get(coreEntity) + 1;
    bytes32 boxEntity;

    if (newLevel == 5) {
      // Get all level 5 boxes
      bytes32[][] memory levelFiveBoxes = LibBox.getInactiveBoxesByLevel(5);
      // If there is an inactive box, join it
      if (levelFiveBoxes.length > 0) {
        boxEntity = levelFiveBoxes[0][0];
        // There are now 2 cores in the box, activate it
        Active.set(boxEntity, true);
      } else {
        // Create box entity (inactive)
        boxEntity = LibBox.create(newLevel, 4, 4, 2, 2, false);
      }
    } else {
      // Create box entity (active)
      boxEntity = LibBox.create(newLevel, 4, 4, 1, 1, true);
    }

    // Level up core entity
    CarriedBy.set(coreEntity, boxEntity);
    Level.set(coreEntity, newLevel);

    // TODO: create ports on core entity
    // TODO: destroy old box
    // ...

    return boxEntity;
  }
}
